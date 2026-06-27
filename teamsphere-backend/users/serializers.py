from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'date_joined',
        ]
        read_only_fields = fields


class UserMeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'date_joined',
        ]
        read_only_fields = fields
