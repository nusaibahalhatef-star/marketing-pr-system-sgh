"""
تصدير جميع النماذج
"""

from src.models.user_model import User
from src.models.task_model import Task
from src.models.campaign_model import Campaign
from src.models.patient_model import Patient
from src.models.appointment_model import Appointment
from src.models.interaction_model import PatientInteraction
from src.models.notification_model import Notification
from src.models.content_model import DigitalContent

__all__ = [
    'User',
    'Task',
    'Campaign',
    'Patient',
    'Appointment',
    'PatientInteraction',
    'Notification',
    'DigitalContent'
]
