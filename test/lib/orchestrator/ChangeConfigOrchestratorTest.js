const td = require('testdouble');
const chai = require('chai');
const tdChai = require('testdouble-chai');

chai.should();
chai.use(tdChai(td));

const changeConfigOrchestratorFactory = require('../../../lib/orchestrator/ChangeConfigOrchestrator');

describe('ChangeConfigOrchestrator', () => {
    const expectedId = 'syntheticId';
    const expectedFrequency = 5;
    const expectedLocations = ['location1', 'location2'];
    const expectedUri = 'http://newuri.com';
    const expectedStatus = 'ENABLED';
    const expectedNewName = 'newSyntheticName';

    it ('call to NR to change configuration by id', () => {

        const newRelicServiceMock = {
            updateMonitorSettings: td.function()
        }

        td.when(newRelicServiceMock.updateMonitorSettings(
            td.matchers.isA(String),
            td.matchers.isA(Number),
            td.matchers.isA(Array),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback();

        const syntheticsListFileService = {};

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        changeConfigOrchestrator.changeConfigurationById(
            expectedId, expectedFrequency, expectedLocations, expectedUri, expectedStatus, expectedNewName, null, null, (err) => {
                newRelicServiceMock.updateMonitorSettings.should.have.been.calledWith(
                    expectedId,
                    expectedFrequency,
                    expectedLocations,
                    expectedUri,
                    expectedStatus,
                    expectedNewName,
                    td.callback
                );
            }
        );
    });

    it ('should show an error when NR has an error by id', () => {
        const expectedError = 'error with NR';

        const newRelicServiceMock = {
            updateMonitorSettings: td.function()
        }

        td.when(newRelicServiceMock.updateMonitorSettings(
            td.matchers.isA(String),
            td.matchers.isA(Number),
            td.matchers.isA(Array),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback(expectedError);

        const syntheticsListFileService = {};

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        (() => {
            changeConfigOrchestrator.changeConfigurationById(
                expectedId, expectedFrequency, expectedLocations, expectedUri, expectedStatus, expectedNewName
            );
        }).should.throw(expectedError);
    });

    it ('should show an error when NR has an error by id using callback', () => {
        const expectedError = 'error with NR';

        const newRelicServiceMock = {
            updateMonitorSettings: td.function()
        }

        td.when(newRelicServiceMock.updateMonitorSettings(
            td.matchers.isA(String),
            td.matchers.isA(Number),
            td.matchers.isA(Array),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback(expectedError);

        const syntheticsListFileService = {};

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        changeConfigOrchestrator.changeConfigurationById(
            expectedId, expectedFrequency, expectedLocations, expectedUri, expectedStatus, expectedNewName, null, null, (err) => {
                err.should.be.equal(expectedError);
            }
        );
    });

    it ('call to NR to change configuration by name', () => {
        const expectedName = 'syntheticName';

        const newRelicServiceMock = {
            updateMonitorSettings: td.function()
        }

        td.when(newRelicServiceMock.updateMonitorSettings(
            td.matchers.isA(String),
            td.matchers.isA(Number),
            td.matchers.isA(Array),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback();

        const syntheticsListFileService = {
            getSynthetic: td.function()
        };

        td.when(syntheticsListFileService.getSynthetic(
            expectedName,
            td.callback
        )).thenCallback({id: expectedId});

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        changeConfigOrchestrator.changeConfigurationByName(
            expectedName,
            expectedFrequency,
            expectedLocations,
            expectedUri,
            expectedStatus,
            expectedNewName
        );

        newRelicServiceMock.updateMonitorSettings.should.have.been.calledWith(
            expectedId,
            expectedFrequency,
            expectedLocations,
            expectedUri,
            expectedStatus,
            expectedNewName,
            td.callback
        );
    });

    it ('should show an error when synthetic name cannot be found', () => {
        const expectedName = 'syntheticName';
        const expectedError = 'cannot find synthetic';

        const newRelicServiceMock = {
            updateMonitorSettings: td.function()
        }

        td.when(newRelicServiceMock.updateMonitorSettings(
            td.matchers.isA(String),
            td.matchers.isA(Number),
            td.matchers.isA(Array),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback(expectedError);

        const syntheticsListFileService = {
            getSynthetic: td.function()
        };

        td.when(syntheticsListFileService.getSynthetic(
            expectedName,
            td.callback
        )).thenCallback(null, expectedError);

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        (() => {
            changeConfigOrchestrator.changeConfigurationByName(
                expectedName, expectedFrequency, expectedLocations, expectedUri, expectedStatus, expectedNewName
            );
        }).should.throw(expectedError);
    });

    it ('call to NR to add alert emails by id', () => {
        const expectedEmails = ['email1@email.com', 'email2@email.com'];

        const newRelicServiceMock = {
            addAlertEmails: td.function()
        }

        td.when(newRelicServiceMock.addAlertEmails(
            td.matchers.isA(String),
            td.matchers.isA(Array),
            td.callback
        )).thenCallback();

        const syntheticsListFileService = {};

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        changeConfigOrchestrator.changeConfigurationById(
            expectedId, null, null, null, null, null, expectedEmails, null, (err) => {
                newRelicServiceMock.addAlertEmails.should.have.been.calledWith(
                    expectedId,
                    expectedEmails,
                    td.callback
                );
            }
        );
    });

    it ('call to NR to remove alert email by id', () => {
        const expectedEmail = 'email1@email.com';

        const newRelicServiceMock = {
            removeAlertEmail: td.function()
        }

        td.when(newRelicServiceMock.removeAlertEmail(
            td.matchers.isA(String),
            td.matchers.isA(String),
            td.callback
        )).thenCallback();

        const syntheticsListFileService = {};

        const changeConfigOrchestrator = changeConfigOrchestratorFactory(newRelicServiceMock, syntheticsListFileService);

        changeConfigOrchestrator.changeConfigurationById(
            expectedId, null, null, null, null, null, null, expectedEmail, (err) => {
                newRelicServiceMock.removeAlertEmail.should.have.been.calledWith(
                    expectedId,
                    expectedEmail,
                    td.callback
                );
            }
        );
    });
});