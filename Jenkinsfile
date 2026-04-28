pipeline {
    agent { label 'nodeJS' }

    environment {
        // REMPLACE par ton pseudo Docker Hub réel
        DOCKER_USER = 'ton_username_dockerhub'
        IMAGE_NAME = 'page-helloworld'
        SONAR_PROJECT_KEY = 'mon_projet_key' 
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/RainderAx/page-helloworld.git'
            }
        }

        stage('Build & Test') {
            steps {
                sh 'npm install'
                sh 'npm run build'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh """
                    sonar-scanner \
                      -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=http://sonarqube_container:9000 \
                      -Dsonar.token=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_VAR')]) {
                        // Build de l'image
                        sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID} ."
                        sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID} ${DOCKER_USER}/${IMAGE_NAME}:latest"

                        // Login et Push
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER_VAR --password-stdin"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }
}