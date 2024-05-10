import logging
import time
from django.db import connection, reset_queries


def metric_middleware(get_response):
    def middleware(request):
        reset_queries()
        start_queries = len(connection.queries)
        start_time = time.perf_counter()
        response = get_response(request)
        end_time = time.perf_counter()
        end_queries = len(connection.queries)

        total_time = end_time - start_time
        total_queries = end_queries - start_queries

        logger = logging.getLogger('debug')
        logger.debug(f"Request: {request.method} {request.path}")
        logger.debug(f"Total queries: {total_queries}")
        logger.debug(f"Total time: {total_time} seconds")
        return response
    return middleware
