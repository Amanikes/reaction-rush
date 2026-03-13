pipeline {
    agent any
    parameters{
        choice (name: 'Version', choices: ['1.0.0', '1.1.0', '1.2.0'], description: 'Select the version to build')
        booleanParam(name: 'executeTests', defaultValue: true, description: 'Run tests after building?')
    }

    environment {
     NEW_VERSION  = "1.3.0"
     SERVER_CREDENTIALS = credentials('server-credentials')
    }
    stages{
        stage("build"){
            steps{
                echo 'Building the application...'
                echo "building version ${NEW_VERSION}..."
            }
        }
        stage("test"){
            
            when {
                expression {
                    params.executeTests
                }
            }
            steps{
                echo 'Running tests...'
            }
        }
        stage("deploy"){
            steps{
                echo 'Deploying the application...'
                echo "Deploying version ${NEW_VERSION} to the server with credentials ${SERVER_CREDENTIALS}..."
            }}

    }
    post{
        always{
            echo 'Cleaning up...'
        }
    }   
}