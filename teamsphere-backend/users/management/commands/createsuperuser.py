from django.contrib.auth.management.commands.createsuperuser import (
    Command as BaseCreateSuperuserCommand,
)


class Command(BaseCreateSuperuserCommand):
    def get_input_data(self, field, message, default=None):
        value = super().get_input_data(field, message, default)
        if value is not None and field.name == 'username':
            if self.UserModel._default_manager.filter(username=value).exists():
                self.stderr.write('Error: That username is already taken.')
                return None
        return value
