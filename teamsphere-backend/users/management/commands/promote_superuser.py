from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Promote an existing user to superuser (and optionally reset password)'

    def add_arguments(self, parser):
        group = parser.add_mutually_exclusive_group(required=True)
        group.add_argument('--email', help='Email of the user to promote')
        group.add_argument('--username', help='Username of the user to promote')
        parser.add_argument('--password', help='Set a new password for the user')

    def handle(self, *args, **options):
        User = get_user_model()
        lookup = {'email': options['email']} if options['email'] else {'username': options['username']}

        try:
            user = User.objects.get(**lookup)
        except User.DoesNotExist:
            raise CommandError(f'No user found with {next(iter(lookup))}="{next(iter(lookup.values()))}"')

        user.is_superuser = True
        user.is_staff = True
        if hasattr(user, 'role'):
            user.role = 'admin'

        if options['password']:
            user.set_password(options['password'])

        user.save()

        self.stdout.write(self.style.SUCCESS(
            f'Promoted "{user.email}" (username: {user.username}) to superuser.'
        ))
