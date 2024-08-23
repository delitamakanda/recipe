from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def core_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    handlers = {'ValidationError': handle_generic_validation_error}
    exception_class = exc.__class__.__name__

    # Now add the HTTP status code to the response.
    if exception_class in handlers:
        return handlers[exception_class](exc, context, response)

    return response


def handle_generic_validation_error(exc, context, response=None):
    if response:
        response.data = {'errors': response.data, 'context': context}
        return response
    return None
