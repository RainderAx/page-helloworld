pipeline {
    agent any 
    stages {
        stage('Checkout'){
            steps {
                git branch: 'main', url:
                'https://github.com/RainderAx/page-helloworld.git'
            }
        }
        stage('Deploy'){
            steps {
                withCredentials([usernamePassword(credentialsId:'1',usernameVariable: 'USER',passwordVariable:'PASS')]){
                    sh '"sshpass -p "$PASS" scp -o StrickHostKeyChecking=no index.html $USER@ssh-rainderdomain.alwaysdata.net:/home/rainderdomain/www/"'
                }
            }
        }
    }
}
