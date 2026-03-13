def gv
pipeline {
    agent any
    parameters {
        choice(name: 'Version', choices: ['1.0.0', '1.1.0', '1.2.0'], description: 'Select the version to build')
        booleanParam(name: 'executeTests', defaultValue: true, description: 'Run tests after building?')
    }

    environment {
        NEW_VERSION  = '1.3.0'
        SERVER_CREDENTIALS = credentials('server-credentials')
    }
    stages {
        stage('init') {
            steps {
                script {
                    gv = load 'script.groovy'
                }
            }
        }
        stage('build') {
            steps {
                script {
                    gv.buildApp()
                }
            }
        }
        stage('test') {
            when {
                expression {
                    params.executeTests
                }
            }
            steps {
                script {
                    gv.testApp()
                }
            }
        }
        stage('deploy') {
            steps {
                script {
                    gv.deployApp()
                }
            }
        }
    }
    post {
        always {
            echo 'Cleaning up...'
        }
    }
}
