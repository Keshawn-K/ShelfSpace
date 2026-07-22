from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db import IntegrityError
from .models import Shelf


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Create default shelves
        default_shelves = ['Want to Try', 'In Progress', 'Finished']
        for shelf_name in default_shelves:
            Shelf.objects.create(user=user, name=shelf_name, is_default=True)

        return Response(
            {'message': 'User created successfully', 'user_id': user.id},
            status=status.HTTP_201_CREATED
        )

    except IntegrityError:
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )