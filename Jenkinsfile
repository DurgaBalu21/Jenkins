pipeline {
  agent any

  parameters {
    string(name: 'CUCUMBER_TAGS', defaultValue: '@smoke', description: 'Cucumber tag expression (e.g. @smoke or @smoke and not @wip)')
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Playwright browser')
    choice(name: 'ENV', choices: ['qa', 'stage', 'prod'], description: 'Which env config to use')
    booleanParam(name: 'HEADLESS', defaultValue: true, description: 'Run headless?')
  }

  environment {
    CI = "true"
    NPM_CONFIG_FUND = "false"
    NPM_CONFIG_AUDIT = "false"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Node & Install Deps') {
      steps {
        bat '''
          node -v
          npm -v
          npm ci
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        bat '''
          npx playwright install
        '''
      }
    }

    stage('Set Env Path') {
      steps {
        script {
          env.DOTENV_CONFIG_PATH = ".env.${params.ENV}"
        }
      }
    }

    stage('Run Cucumber Tests') {
      steps {
        bat """
          echo Running with tags: ${params.CUCUMBER_TAGS}
          echo Using env file: %DOTENV_CONFIG_PATH%
          echo Browser: ${params.BROWSER}, Headless: ${params.HEADLESS}

          set BROWSER=${params.BROWSER}
          set HEADLESS=${params.HEADLESS}
          set CUCUMBER_TAGS=${params.CUCUMBER_TAGS}

          npm run test:cucumber -- --tags %CUCUMBER_TAGS%
        """
      }
    }
  }

  post {
    always {
        archiveArtifacts artifacts: 'reports/**/*, cucumber-report/**/*, test-results/**/*, playwright-report/**/*', allowEmptyArchive: true
        junit testResults: 'test-results/**/*.xml', allowEmptyResults: true
        publishHTML(target: [
            allowMissing: true,
            alwaysLinkToLastBuild: true,
            keepAll: true,
            reportDir: 'playwright-report',
            reportFiles: 'index.html',
            reportName: 'Playwright HTML Report'
        ])
    }
}
