pipeline {
  agent any

  options {
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  parameters {
    string(name: 'CUCUMBER_TAGS', defaultValue: '@smoke', description: 'Cucumber tag expression (e.g. @smoke or @smoke and not @wip)')
    choice(name: 'BROWSER', choices: ['chromium', 'firefox', 'webkit'], description: 'Playwright browser')
    choice(name: 'ENV', choices: ['qa', 'stage', 'prod'], description: 'Which env config to use')
    booleanParam(name: 'HEADLESS', defaultValue: true, description: 'Run headless?')
  }

  environment {
    // Speeds up installs
    CI = "true"
    NPM_CONFIG_FUND = "false"
    NPM_CONFIG_AUDIT = "false"

    // If you use .env files like .env.qa, .env.stage...
    DOTENV_CONFIG_PATH = ".env.${params.ENV}"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Node & Install Deps') {
      steps {
        sh '''
          node -v
          npm -v
          npm ci
        '''
      }
    }

    stage('Install Playwright Browsers') {
      steps {
        sh '''
          npx playwright install --with-deps
        '''
      }
    }

    stage('Run Cucumber Tests') {
      steps {
        sh """
          echo "Running with tags: ${params.CUCUMBER_TAGS}"
          echo "Using env file: ${env.DOTENV_CONFIG_PATH}"
          echo "Browser: ${params.BROWSER}, Headless: ${params.HEADLESS}"

          # Export for your hooks/config to read
          export BROWSER=${params.BROWSER}
          export HEADLESS=${params.HEADLESS}
          export CUCUMBER_TAGS="${params.CUCUMBER_TAGS}"

          # If you use dotenv-cli or dotenv package, it will load DOTENV_CONFIG_PATH
          npm run test:cucumber -- --tags "${params.CUCUMBER_TAGS}"
        """
      }
    }
  }

  post {
    always {
      // Archive reports if you generate them
      archiveArtifacts artifacts: 'reports/**/*, cucumber-report/**/*, test-results/**/*, playwright-report/**/*', allowEmptyArchive: true

      // Optional JUnit publish (only if you generate junit xml)
      junit testResults: 'test-results/**/*.xml', allowEmptyResults: true

      // Optional: publish HTML report (needs "HTML Publisher" plugin)
      publishHTML(target: [
        allowMissing: true,
        alwaysLinkToLastBuild: true,
        keepAll: true,
        reportDir: 'cucumber-report',
        reportFiles: 'index.html',
        reportName: 'Cucumber HTML Report'
      ])
    }
  }
  
}
