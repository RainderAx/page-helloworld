pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = 'rainder'
        IMAGE_NAME = 'ma-landing-page'
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/RainderAx/page-helloworld.git'
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest ."
            }
        }

        stage('Login & Push') {
            steps {
                // Vérifie bien que cet ID existe dans tes Credentials Jenkins
                withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                    sh "echo ${PASS} | docker login -u ${USER} --password-stdin"
                    sh "docker push ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
                }
            }
        }

        stage('Deploy') {
            steps {
                sh "docker rm -f landing-container || true"
                sh "docker run -d -p 80:80 --name landing-container ${DOCKER_HUB_USER}/${IMAGE_NAME}:latest"
            }
        }
    }
}
