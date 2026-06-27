from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Team

User = get_user_model()


class TeamMemberSerializer(serializers.ModelSerializer):
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


class TeamSerializer(serializers.ModelSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members', 'created_at']

    def create(self, validated_data):
        member_ids = self.initial_data.get('members', [])
        team = Team.objects.create(**validated_data)
        if member_ids is not None:
            team.members.set(member_ids)
        return team

    def update(self, instance, validated_data):
        member_ids = self.initial_data.get('members')
        instance = super().update(instance, validated_data)
        if member_ids is not None:
            instance.members.set(member_ids)
        return instance
