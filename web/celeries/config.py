#!/usr/bin/env python
#-*- coding: utf-8 -*-


broker_url = 'redis://localhost:6379/0'
result_backend = 'redis://localhost:6379/1'
imports = ['celeries.tasks']
beat_schedule = {
    'update-monitor-status': {
        'task': 'celeries.tasks.update_monitor_status',
        'schedule': 3600,
    }
}
