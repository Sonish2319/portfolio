pipeline {

    agent any

    environment {
        DOCKER_IMAGE = 'sonish2319/nextjs-portfolio'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Commit') {
            steps {
                script {
                    def commitMessage = sh(
                        script: 'git log -1 --pretty=%B',
                        returnStdout: true
                    ).trim()

                    echo "Commit message:"
                    echo commitMessage

                    if (commitMessage.contains('[skip ci]')) {
                        currentBuild.result = 'NOT_BUILT'
                        error('Skipping CI because commit contains [skip ci]')
                    }
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        // stage('Test') {
        //     steps {
        //         sh 'npm run lint'
        //     }
        // }

        stage('Generate Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short=7 HEAD',
                        returnStdout: true
                    ).trim()

                    echo "IMAGE TAG: ${IMAGE_TAG}"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                            -u "$DOCKER_USERNAME" \
                            --password-stdin
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '''
                    docker build \
                        -t ${DOCKER_IMAGE}:${IMAGE_TAG} \
                        .
                '''
            }
        }

        stage('Docker Push') {
            steps {
                sh '''
                    docker push ${DOCKER_IMAGE}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/portfolio \
                        portfolio=${DOCKER_IMAGE}:${IMAGE_TAG} \
                        -n portfolio
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status deployment/portfolio \
                        -n portfolio
                '''
            }
        }
    }

    post {

        success {
            echo 'CI/CD PIPELINE SUCCESSFUL'
        }

        failure {
            echo 'CI/CD PIPELINE FAILED'
        }

        always {
            sh 'docker logout || true'
        }
    }
}