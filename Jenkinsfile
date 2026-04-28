pipeline {
    agent { label 'nodeJS' } // Utilise l'agent avec Node et Docker installé [cite: 4]

    environment {
        // Remplace par tes vraies valeurs
        DOCKER_USER = 'ton_username_dockerhub'
        IMAGE_NAME = 'page-helloworld'
        SONAR_PROJECT_KEY = 'mon_projet_key' // Ta clé projet SonarQube
    }

    stages {
        stage('Clone') {
            steps {
                git branch: 'main', url: 'https://github.com/RainderAx/page-helloworld.git' [cite: 4]
            }
        }

        stage('Build & Test') {
            steps {
                sh 'npm install' [cite: 5]
                sh 'npm run build' [cite: 5]
                // sh 'npm run test' // Décommente si tu as des tests unitaires 
            }
        }

        stage('SonarQube Analysis') {
            steps {
                // On utilise le credential 'sonar-token' créé précédemment
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh """
                    sonar-scanner \
                      -Dsonar.projectKey=${SONAR_PROJECT_KEY} \
                      -Dsonar.sources=. \
                      -Dsonar.host.url=http://sonarqube_container:9000 \
                      -Dsonar.token=${SONAR_TOKEN}
                    """ [cite: 7, 8]
                }
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    // Connexion à Docker Hub avec les identifiants Jenkins
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER_VAR')]) {
                        
                        // 1. Build de l'image
                        sh "docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID} ."
                        sh "docker tag ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID} ${DOCKER_USER}/${IMAGE_NAME}:latest"

                        // 2. Login et Push
                        sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER_VAR --password-stdin"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:${env.BUILD_ID}"
                        sh "docker push ${DOCKER_USER}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }
}