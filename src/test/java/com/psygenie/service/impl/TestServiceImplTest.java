package com.psygenie.service.impl;

import com.psygenie.model.repostiory.TestRepository;
import com.psygenie.service.TestService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

class TestServiceImplTest {
    private final TestRepository mockTestRepository = Mockito.mock(TestRepository.class);
    private final TestService mockTestService = Mockito.mock(TestService.class);

    @Test
    void save_test_results_should_work() {
        com.psygenie.model.entities.Test test = new com.psygenie.model.entities.Test();
        when(mockTestRepository.save(Mockito.any(com.psygenie.model.entities.Test.class)))
                .thenAnswer(i -> i.getArguments()[0]);
        mockTestService.saveTestResults(test);

        assertNotNull(mockTestRepository.findById(1L));
    }
}