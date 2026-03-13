def buildApp() {
    echo 'building the application...'
}

def testApp() {
    echo 'testing the application...'
}

def deployApp() {
    echo 'Deploying the application...'
    echo "Deploying version ${params.NEW_VERSION} to the server with credentials ${SERVER_CREDENTIALS}..."
}
return this
