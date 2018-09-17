const fs = require('fs');
const request = require('request');
const mkdirp = require('mkdirp');

const defaults = require('./config/Defaults');

const fileServiceFactory = require('./service/FileService');
const newRelicServiceFactory = require('./service/NewRelicService');
const syntheticsFileServiceFactory = require('./service/SyntheticsFileService');
const syntheticsListFileServiceFactory = require('./service/SyntheticsListFileService');

const createMonitorOrchestratorFactory = require('./orchestrator/CreateMonitorOrchestrator');
const updateMonitorOrchestratorFactory = require('./orchestrator/UpdateMonitorOrchestrator');
const importMonitorOrchestratorFactory = require('./orchestrator/ImportMonitorOrchestrator');
const listLocationsOrchestratorFactory = require('./orchestrator/ListLocationsOrchestrator');
const changeConfigOrchestratorFactory = require('./orchestrator/ChangeConfigOrchestrator');

module.exports = (config) => {
    const fileService = fileServiceFactory(fs, mkdirp);
    const newRelicService = newRelicServiceFactory(config.apikey, request);
    const syntheticsFileService = syntheticsFileServiceFactory(
        config.syntheticsDirectory, 
        fileService,
        defaults
    );
    const syntheticsListFileService = syntheticsListFileServiceFactory(
        config.syntheticsListFile,
        fileService
    );

    const createMonitorOrchestrator = createMonitorOrchestratorFactory(
        syntheticsFileService,
        newRelicService,
        syntheticsListFileService,
        defaults
    );
    const updateMonitorOrchestrator = updateMonitorOrchestratorFactory(
        syntheticsListFileService,
        syntheticsFileService,
        newRelicService
    );
    const importMonitorOrchestrator = importMonitorOrchestratorFactory(
        syntheticsListFileService,
        syntheticsFileService,
        newRelicService,
        defaults
    );
    const listLocationsOrchestrator = listLocationsOrchestratorFactory(
        newRelicService
    );
    const changeConfigOrchestrator = changeConfigOrchestratorFactory(
        newRelicService,
        syntheticsListFileService
    );


    return {
        fileService: fileService,
        newRelicService: newRelicService,
        syntheticsFileService: syntheticsFileService,
        syntheticsListFileService: syntheticsListFileService,
        createMonitorOrchestrator: createMonitorOrchestrator,
        updateMonitorOrchestrator: updateMonitorOrchestrator,
        importMonitorOrchestrator: importMonitorOrchestrator,
        listLocationsOrchestrator: listLocationsOrchestrator,
        changeConfigOrchestrator: changeConfigOrchestrator,
    };
};
