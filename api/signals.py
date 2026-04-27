from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Review, Notification

@receiver(post_save, sender=Review)
def create_review_notification(sender, instance, created, **kwargs):
    if created:
        point = instance.point
        owner = point.owner
        
        # Если у точки есть владелец, создаем ему уведомление
        if owner:
            Notification.objects.create(
                user=owner,
                title="Новый отзыв!",
                message=f"Пользователь {instance.user.username} оставил отзыв ({instance.rating}/5) о вашей точке '{point.name}'."
            )