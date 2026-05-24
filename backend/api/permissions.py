from rest_framework import permissions

class IsPointOwner(permissions.BasePermission):
    """
    Разрешает редактирование только владельцу пункта.
    """
    def has_object_permission(self, request, view, obj):
        # Чтение (GET, HEAD, OPTIONS) разрешено всем
        if request.method in permissions.SAFE_METHODS:
            return True
            
        # Запись разрешена только владельцу
        # (Убедись, что в модели Point у тебя есть поле owner)
        return obj.point.owner == request.user