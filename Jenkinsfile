pipline {
    agent any
    tools{
        nodejs 'npm'
    }
    stages {
        stage('build') {
            steps {
                script {
                    echo 'Building the application'
                    sh 'npm install'
                    sh 'npm build'
                }
            }
        }
        stage('build image'){
            steps{
                script{
                    echo 'Building the docker image'
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-repo' , passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        sh "docker build -t amanikes/amanikes:nestjs-1.0 ."
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push amanikes/amanikes:nestjs-1.0"
                    }
                }
            }
        }
        stage('deploy') {
            steps {
                script {
                    echo 'Deploying the application'
                }
            }
        }
    
    }
}
