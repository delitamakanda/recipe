from django.core.exceptions import ValidationError
from django.core.validators import validate_email as django_validate_email


def validate_email(email):
    message_invalid_email = 'Invalid email address'

    if not email:
        return False, message_invalid_email

    try:
        django_validate_email(email)
    except ValidationError:
        return False, message_invalid_email

    return True, ''
