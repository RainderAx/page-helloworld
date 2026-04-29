pipeline {
    agent { label 'nodeJS' } 

    environment {
        DOCKER_CREDS = credentials('docker-hub-credentials')

        IMAGE_NAME = 'frontend-crisisview'

        SONAR_PROJECT_KEY = 'mon_projet_key' 
    }

    stages {
        stage('Clone') {
            steps {

                git branch: 'main', url: 'https://github.com/Rainder/frontend_crisisview'
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
                      -Dsonar.host.url=http://sonarqube-container:9000 \
                      -Dsonar.token=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                   
                    sh "docker build -t ${DOCKER_CREDS_USR}/${IMAGE_NAME}:${env.BUILD_ID} ."
                    sh "docker tag ${DOCKER_CREDS_USR}/${IMAGE_NAME}:${env.BUILD_ID} ${DOCKER_CREDS_USR}/${IMAGE_NAME}:latest"

                    
                    sh "echo ${DOCKER_CREDS_PSW} | docker login -u ${DOCKER_CREDS_USR} --password-stdin"
                    sh "docker push ${DOCKER_CREDS_USR}/${IMAGE_NAME}:${env.BUILD_ID}"
                    sh "docker push ${DOCKER_CREDS_USR}/${IMAGE_NAME}:latest"
                }
            }
        }
        
        stage('Deploy Staging') {
            steps {
               
                sh "docker compose up -d"
            }
        }
    }
}
