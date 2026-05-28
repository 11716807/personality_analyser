package com.psygenie.service;

import com.psygenie.model.entities.AppClient;
import com.psygenie.model.entities.UserEntity;
import org.springframework.scheduling.annotation.Async;

public interface NotificationService {
    @Async
    void sendNotification(UserEntity userEntity);
}
