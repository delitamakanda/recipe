from django.contrib.auth import authenticate
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .models import User
from .utils import validate_email as email_is_valid


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'bio', 'full_name', 'birth_date', ]

    @staticmethod
    def validate_email(value):
        valid, error_text = email_is_valid(value)
        if not valid:
            raise serializers.ValidationError(error_text)
        try:
            email_name, domain_part = value.strip().rsplit('@', 1)
        except ValueError:
            pass
        else:
            value = '@'.join([email_name, domain_part.lower()])

        return value

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.bio = validated_data.get('bio', '')
        user.full_name = validated_data.get('full_name', '')
        user.birth_date = validated_data.get('birth_date', None)
        user.save()
        return user


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)
    username = serializers.CharField(max_length=255, read_only=True)
    tokens = serializers.SerializerMethodField(read_only=True)

    @staticmethod
    def get_tokens(obj):
        user = User.objects.get(email=obj['email'])
        return {'refresh': user.tokens['refresh'], 'access': user.tokens['access']}

    class Meta:
        model = User
        fields = ['email', 'password', 'username', 'tokens', 'full_name',]
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, attrs):
        email = attrs.get('email', '')
        password = attrs.get('password', '')

        if email is None:
            raise  exceptions.ValidationError('Email is required to login.')
        if password is None:
            raise  exceptions.ValidationError('Password is required to login.')

        user = authenticate(username=email, password=password)
        if not user:
            raise exceptions.AuthenticationFailed('Invalid credentials, try again.')
        if not user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted.')

        return user


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'bio', 'full_name', 'birth_date', 'tokens', 'is_staff',]
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ['tokens', 'is_staff',]

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for (key, value) in validated_data.items():
            setattr(instance, key, value)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def __init__(self, instance=None, data=None):
        super().__init__(instance, data)
        self.token = None

    def validate(self, attrs):
        self.token = attrs['refresh']
        return attrs

    def save(self, **kwargs):
        try:
            RefreshToken(self.token).blacklist()
        except TokenError as ex:
            raise exceptions.AuthenticationFailed(ex)
