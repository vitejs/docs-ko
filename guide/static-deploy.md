# 정적 웹 페이지로 배포하기 {#deploying-a-static-site}

이 곳의 내용은 아래와 같이 설정하였다고 가정한 상태에서 진행합니다.

- 빌드 결과물이 저장되는 디렉터리를 기본 디렉터리(`dist`)로 지정한 상태입니다. 물론 [`build.outDir` 설정 값을 이용해 바꿀 수는 있으나](/config/#build-outdir), 여기서는 `dist`를 빌드 디렉터리로 지정했다 가정하고 진행합니다.
- NPM 또는 NPM 스크립트를 실행할 수 있는 Yarn과 같은 패키지 매니저를 사용하고 있습니다.
- vite는 로컬 PC에 존재하는 프로젝트에 개발용(Dev) 디펜던시로 설치된 상태이며, 아래와 같이 NPM 스크립트를 설정한 상태입니다.

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

한 가지 유의할 점은, `vite preview` 명령은 로컬에서 어떤 형태로 빌드가 되는지 미리 확인하기 위한 용도일 뿐이며, 실제 배포용 서버를 의미하지는 않습니다.

::: tip 참고
이 가이드는 Vite 기반의 사이트를 정적(Static)으로 배포하기 위한 방법을 설명하고 있습니다. 물론 Vite는 서버 측 렌더링(SSR, Server Side Rendering)을 지원하고 있으나, 현재는 실험적인 기능입니다. 참고로 '서버 측 렌더링'이란, Node.js를 이용해 동일한 웹 애플리케이션을 HTML로 사전에 렌더링한 뒤, 이를 클라이언트에게 제공하는 방식의 프런트엔드 프레임워크를 의미합니다. 이에 대해 더 알고자 한다면 [SSR 가이드](./ssr)를 참고해주세요. 만약 기존에 사용하고 있는 서버측 프레임워크(Ror, Laravel 등)가 있다면, [백엔드 통합 가이드](./backend-integration)를 참고해주세요.
:::

## 앱 빌드하기 {#building-the-app}

아래와 같이 `npm run build` 명령을 통해 앱을 빌드할 수 있습니다.

```bash
$ npm run build
```

기본적으로 `dist` 디렉터리에 빌드 결과물이 저장되며, 배포 시 `dist` 디렉터리를 원하는 플랫폼에 맞춰 그대로 배포하면 됩니다.

### 로컬에서 앱 테스트하기 {#testing-the-app-locally}

한 번 빌드된 앱은 `npm run preview` 명령으로 로컬에서 테스트가 가능합니다.

```bash
$ npm run build
$ npm run preview
```

`vite preview` 명령을 실행하게 되면 정적 웹 서버가 실행되며, 이 서버는 `dist` 내에 존재하는 파일을 `http://localhost:4173` 경로를 통해 배포합니다. 브라우저를 통해 사이트에 접속하여 실제 배포 시 어떻게 보여질 것인지 쉽게 파악할 수 있습니다.

만약 특정 포트를 지정하고자 한다면 `--port` 옵션을 이용해주세요.

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

이렇게 설정한 경우 `http://localhost:8080` 을 기준으로 `preview` 명령이 실행됩니다.

::: tip 참고
`serve`에서 `preview`로 스크립트의 이름을 바꾸는 경우, 일부 패키지 매니저에서 [Pre & Post 스크립트](https://docs.npmjs.com/cli/v7/using-npm/scripts#pre--post-scripts)를 처리하는 방식으로 인해 문제가 발생될 수 있습니다.
:::

## GitHub Pages {#github-pages}

1. `vite.config.js` 파일 내 `base` 설정 값을 적절하게 설정합니다.

   만약 `https://<USERNAME>.github.io/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 생략하거나 기본 값인 `'/'` 로 지정해주세요.

   만약 `https://<USERNAME>.github.io/<REPO>/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 `'/<REPO>/'`로 지정해주세요.

2. 프로젝트의 루트에 아래와 같은 내용이 들어간 `deploy.sh` 파일을 생성 및 실행해주세요(하이라이트 된 라인은 필요에 따라 주석 처리를 풀어주세요).

   ```bash{13,20,23}
   #!/usr/bin/env sh

   # 에러가 발생될 경우 스크립트 실행을 중지
   set -e

   # 앱 빌드
   npm run build

   # 빌드된 파일이 존재하는 dist 디렉터리로 이동
   cd dist

   # CNAME 파일을 이용해 커스텀 도메인을 지정할 수도 있습니다.
   # echo 'www.example.com' > CNAME

   git init
   git checkout -b main
   git add -A
   git commit -m 'deploy'

   # https://<USERNAME>.github.io 에 배포
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

   # https://<USERNAME>.github.io/<REPO> 에 배포
   # git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

   cd -
   ```

::: tip
물론 CI 툴을 이용해 위 스크립트 기반으로 배포가 자동으로 이루어지게끔 설정이 가능합니다.
:::

### GitHub Pages 그리고 Travis CI {#github-pages-and-travis-ci}

1. `vite.config.js` 파일 내 `base` 설정 값을 적절하게 지정합니다.

   만약 `https://<USERNAME or GROUP>.github.io/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 생략하거나 기본 값인 `'/'`로 지정해주세요.

   만약 `https://<USERNAME or GROUP>.github.io/<REPO>/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 `'/<REPO>/'`로 지정해주세요.

2. 프로젝트의 루트에 `.travis.yml` 파일을 생성해주세요(파일 내용은 아래 코드를 참고해주세요).

3. `npm install` 명령을 실행한 뒤, `package-lock.json` 파일을 커밋해주세요.

4. [Travis CI 문서](https://docs.travis-ci.com/user/deployment/pages/)를 참고해서 GitHub Pages 배포를 위한 설정을 진행해주세요. 예를 들어 아래와 같이 설정이 가능합니다.

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # Travis가 리포지터리에 Push 할 수 있도록 GitHub에서 $GITHUB_TOKEN을 생성합니다.
     # 생성한 $GITHUB_TOKEN의 값은 Travis 설정 페이지에서 환경 변수로 지정해 사용할 수 있어요.
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: main
   ```

`$GITHUB_TOKEN`과 관련한 내용은 아래 문서를 참고해주세요.

- [개인 액세스 토큰 생성하기 (GitHub)](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Token 설정하기 (Travis)](https://docs.travis-ci.com/user/deployment/pages/#setting-the-github-token)

## GitLab Pages 그리고 GitLab CI {#github-pages-and-gitlab-ci}

1. `vite.config.js` 파일 내 `base` 설정 값을 적절하게 지정합니다.

   만약 `https://<USERNAME or GROUP>.gitlab.io/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 생략하거나 기본 값인 `'/'`로 지정해주세요.

   만약 `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 `'/<REPO>/'`로 지정해주세요.

2. 아래와 같은 내용으로 프로젝트의 루트에 `.gitlab-ci.yml` 파일을 생성해주세요. 이와 같이 설정하게 되면, 콘텐츠가 변경될 때마다 사이트가 빌드 및 배포됩니다.

   ```yaml
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify {#netlify}

1. [Netlify CLI](https://cli.netlify.com/)를 설치해주세요.
2. `ntl init` 또는 `netlify init` 명령으로 새로운 사이트를 생성해주세요.
3. 이제 `ntl deploy` 명령으로 배포할 수 있습니다.

```bash
# Netlify CLI 설치
$ npm install -g netlify-cli

# 새로운 Netlify 사이트 생성
$ ntl init

# 검토를 위한 미기보기 형태로 배포
$ ntl deploy
```

`ntl deploy` 명령은 기본적으로 프리뷰 형태로 사이트를 배포하며, 프리뷰 URL을 출력으로 보여줍니다. 만약 배포할 준비가 모두 완료되어 프로덕션 배포를 하고자 한다면 `prod` 플래그를 사용해주세요:

```bash
# 프로덕션으로 배포
# ntl deploy --prod
```

## Google Firebase {#google-firebase}

1. [firebase-tools](https://www.npmjs.com/package/firebase-tools)가 설치되어 있는지 확인해주세요.

2. 아래와 같은 내용으로 프로젝트 루트에 `firebase.json` 및 `.firebaserc` 파일을 생성해주세요.

   `firebase.json`:

    ```json
    {
      "hosting": {
        "public": "dist",
        "ignore": [],
        "rewrites": [
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    }
    ```

    `.firebaserc`:

    ```js
    {
      "projects": {
        "default": "<YOUR_FIREBASE_ID>"
      }
    }
    ```

3. `npm run build` 명령을 먼저 실행하고, 그 다음 `firebase deploy` 명령을 통해 배포가 가능합니다.

## Surge {#surge}

1. [surge](https://www.npmjs.com/package/surge)가 설치되지 않은 경우, 먼저 설치해주세요.

2. `npm run build` 명령을 실행해주세요.

3. `surge dist` 명령을 통해 Surge로 배포해주세요.

물론, `surge dist yourdomain.com`과 같은 명령을 이용해 [커스텀 도메인](http://surge.sh/help/adding-a-custom-domain)으로 배포할 수도 있습니다.

## Heroku {#heroku}

1. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)를 설치해주세요.

2. [Heroku 가입 페이지](https://signup.heroku.com)에서 계정을 만들어주세요.

3. `heroku login` 명령으로 Heroku에 로그인해주세요.

   ```bash
   $ heroku login
   ```

4. 아래와 같은 내용으로 `static.json` 파일을 프로젝트 루트에 생성해주세요.

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   이러한 방식으로 배포될 사이트에 대한 설정이 가능합니다. 더 많은 정보가 필요하다면 [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static) 리포지터리를 참고해주세요.

5. Heroku Git remote를 설정해주세요.

   ```bash
   # 버전 갱신
   $ git init
   $ git add .
   $ git commit -m "My site ready for deployment."

   # 새로운 애플리케이션 생성
   $ heroku apps:create example

   # 정적 사이트 배포를 위해 Buildpack 정의
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. 마지막으로, 아래 명령을 통해 사이트를 배포하게 됩니다.

   ```bash
   # 사이트 배포
   $ git push heroku main
   
   # Heroku CI 대시보드 열기
   $ heroku open
   ```

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. [Vercel CLI](https://vercel.com/cli)를 설치하고 `vercel`을 실행하여 배포합니다.
2. Vercel은 Vite를 사용하고 있음을 감지하게 되며, 배포와 관련된 올바른 설정을 활성화합니다.
3. 애플리케이션이 배포되었습니다! (예시: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel for Git {#vercel-for-git}

1. 사용하고 있는 Git 리포지터리(GitHub, GitLab, Bitbucket)으로 소스 코드를 Push 합니다.
2. Vercel로 [Vite 프로젝트를 가져옵니다](https://vercel.com/new).
3. Vercel은 Vite를 사용하고 있음을 감지하게 되며, 배포와 관련된 올바른 설정을 활성화합니다.
4. 애플리케이션이 배포되었습니다! (예시: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Vercel로 프로젝트를 불러오고 배포까지 완료했다면, 이후 브랜치에 대한 모든 Push 동작은 애플리케이션에 대한 [프리뷰 배포](https://vercel.com/docs/concepts/deployments/environments#preview)를 생성하게 됩니다. 그리고 프로덕션용 브랜치(일반적으로 "main")에 대한 모든 변경 사항은 [프로덕션 배포](https://vercel.com/docs/concepts/deployments/environments#production)가 됩니다.

이에 대해 좀 더 알고 싶다면 Vercel의 [Git](https://vercel.com/docs/concepts/git) 문서를 참고해주세요.

## Azure Static Web Apps {#azure-static-web-apps}

마이크로소프트 Azure 클라우드 서비스의 [Static Web Apps](https://aka.ms/staticwebapps) 서비스를 이용해 빠르게 Vite 앱을 배포할 수 있습니다.

- Azure 계정과 구독(Subscription) 키가 필요해요. [여기서 무료로 Azure 계정을 만들 수 있답니다](https://azure.microsoft.com/free).
- Vite 앱을 [GitHub](https://github.com)에 Push 해주세요.
- [Visual Studio Code](https://code.visualstudio.com)의 [SWA(Static Web Apps) 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)을 설치해주세요.

VS Code에 확장 프로그램을 설치한 뒤 앱의 루트 디렉터리로 들어가주세요. 이후 설치한 SWA 확장 프로그램을 실행하고, Azure에 로그인 한 뒤, '+' 버튼을 눌러 새로운 정적 웹 앱(Static Web App)을 만들어주세요. 여기서 앞서 생성한 구독 키를 설정하라는 메시지가 나오게 됩니다.

확장 프로그램을 통해 시작된 마법사를 따라 앱 이름을 지정하고, 프레임워크에 대한 사전 설정을 선택한 뒤, 앱 루트(일반적으로 `/`) 및 빌드된 파일 위치(`/dist`)를 지정해주세요. 마법사가 실행되며 `.github` 폴더의 저장소에 GitHub Actions가 구성됩니다.

새로이 구성된 GitHub Action은 앱 배포 시 동작하며(GitHub의 Actions 탭에서 확인할 수 있어요), 성공적으로 완료되면 확장 프로그램의 진행률 창에서 제공되는 'Browse Website' 버튼으로 배포된 앱을 볼 수 있게 됩니다.
