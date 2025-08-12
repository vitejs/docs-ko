# 정적 웹 페이지로 배포하기 {#deploying-a-static-site}

이 곳의 내용은 아래와 같이 설정하였다고 가정한 상태에서 진행합니다.

- 빌드 결과물이 저장되는 디렉터리를 기본 디렉터리(`dist`)로 지정한 상태입니다. 물론 [`build.outDir` 설정 값을 이용해 바꿀 수는 있으나](/config/build-options.md#build-outdir), 여기서는 `dist`를 빌드 디렉터리로 지정했다 가정하고 진행합니다.
- NPM 또는 NPM 스크립트를 실행할 수 있는 Yarn과 같은 패키지 매니저를 사용하고 있습니다.
- vite는 로컬 PC에 존재하는 프로젝트에 개발용(Dev) 디펜던시로 설치된 상태이며, 아래와 같이 NPM 스크립트를 설정한 상태입니다.

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

한 가지 유의할 점은, `vite preview` 명령은 로컬에서 어떤 형태로 빌드가 되는지 미리 확인하기 위한 용도일 뿐이며, 실제 배포용 서버를 의미하지는 않습니다.

::: tip 참고
These guides provide instructions for performing a static deployment of your Vite site. Vite also supports Server-Side Rendering. SSR refers to front-end frameworks that support running the same application in Node.js, pre-rendering it to HTML, and finally hydrating it on the client. Check out the [SSR Guide](./ssr) to learn about this feature. On the other hand, if you are looking for integration with traditional server-side frameworks, check out the [Backend Integration guide](./backend-integration) instead.
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
$ npm run preview
```

`vite preview` 명령을 실행하게 되면 정적 웹 서버가 실행되며, 이 서버는 `dist` 내에 존재하는 파일을 `http://localhost:4173` 경로를 통해 배포합니다. 브라우저를 통해 사이트에 접속하여 실제 배포 시 어떻게 보여질 것인지 쉽게 파악할 수 있습니다.

만약 특정 포트를 지정하고자 한다면 `--port` 옵션을 이용해주세요.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

이렇게 설정한 경우 `http://localhost:8080` 을 기준으로 `preview` 명령이 실행됩니다.

## GitHub Pages {#github-pages}

1. `vite.config.js` 파일 내 `base` 설정값을 적절하게 설정합니다.

    만약 GitHub Pages를 통해 `https://<USERNAME>.github.io/`이나 커스텀 도메인(예: `www.example.com`)에 배포하고자 한다면, `base` 설정값을 `'/'`로 지정해 주세요. 또는 `base`의 기본값이 `'/'`이기 때문에 설정에서 `base`를 제거해도 됩니다.

   만약 `https://<USERNAME>.github.io/<REPO>/`와 같은 형태로 배포하고자 한다면(예: 리포지토리가 `https://github.com/<USERNAME>/<REPO>`인 경우), `base` 설정값을 `'/<REPO>/'`로 지정해 주세요.

2. 리포지토리 설정 페이지에서 GitHub Pages 설정으로 이동한 후, 배포 소스를 "GitHub Actions"로 지정해 주세요. 이를 통해 프로젝트를 빌드하고 배포하는 워크플로우를 생성할 수 있습니다. 아래는 npm을 이용해 의존성을 설치하고 빌드하는 예시입니다:

   <<< ./static-deploy-github-pages.yaml#content

## GitLab Pages 그리고 GitLab CI {#github-pages-and-gitlab-ci}

1. `vite.config.js` 파일 내 `base` 설정 값을 적절하게 지정합니다.

   만약 `https://<USERNAME or GROUP>.gitlab.io/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 생략하거나 기본 값인 `'/'`로 지정해주세요.

   만약 `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`와 같은 형태로 배포하고자 한다면, `base` 설정 값을 `'/<REPO>/'`로 지정해주세요.

2. 아래와 같은 내용으로 프로젝트의 루트에 `.gitlab-ci.yml` 파일을 생성해주세요. 이와 같이 설정하게 되면, 콘텐츠가 변경될 때마다 사이트가 빌드 및 배포됩니다.

   ```yaml [.gitlab-ci.yml]
   image: node:lts
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

             node-version: lts/*

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
$ ntl deploy --prod
```

### Netlify with Git {#netlify-with-git}

1. 코드를 Git 리포지토리(GitHub, GitLab, BitBucket, Azure DevOps)에 Push 해주세요.
2. Netlify에서 [프로젝트를 불러와주세요](https://app.netlify.com/start).
3. 배포될 브랜치를 선택하고, 빌드 결과물이 들어갈 디렉터리와 필요하다면 환경 변수를 설정해주세요.
   image: node:lts
5. Vite 앱이 배포되었습니다!

프로젝트를 가져와 배포한 후, Pull Request와 배포용 브랜치가 아닌 다른 모든 브랜치에 새로이 Push되는 내용에 대해서는 [프리뷰 버전 배포 환경](https://docs.netlify.com/site-deploys/deploy-previews/)이 구성되며, 배포용 브랜치(일반적으로 "main")에 대한 변경 사항은 [프로덕션 버전으로 배포됩니다](https://docs.netlify.com/site-deploys/overview/#definitions).

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

1. 사용하고 있는 Git 리포지토리(GitHub, GitLab, Bitbucket)으로 소스 코드를 Push 합니다.
2. Vercel로 [Vite 프로젝트를 가져옵니다](https://vercel.com/new).
3. Vercel은 Vite를 사용하고 있음을 감지하게 되며, 배포와 관련된 올바른 설정을 활성화합니다.
4. 애플리케이션이 배포되었습니다! (예시: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Vercel로 프로젝트를 불러오고 배포까지 완료했다면, 이후 브랜치에 대한 모든 Push 동작은 애플리케이션에 대한 [프리뷰 배포](https://vercel.com/docs/concepts/deployments/environments#preview)를 생성하게 됩니다. 그리고 프로덕션용 브랜치(일반적으로 "main")에 대한 모든 변경 사항은 [프로덕션 배포](https://vercel.com/docs/concepts/deployments/environments#production)가 됩니다.

이에 대해 좀 더 알고 싶다면 Vercel의 [Git](https://vercel.com/docs/concepts/git) 문서를 참고해주세요.

## Cloudflare Pages {#cloudflare-pages}

### Wrangler를 이용한 Cloudflare Pages 배포 {#cloudflare-pages-via-wrangler}

1. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/)를 설치합니다.
2. `wrangler login` 명령을 통해 Cloudflare 계정으로 Wrangler를 인증합니다.
3. 프로젝트에 대한 빌드 명령을 실행합니다.
4. `npx wrangler pages deploy dist`를 사용해 배포합니다.

```bash
# Wrangler CLI 설치
$ npm install -g wrangler

# Cloudflare 계정으로 로그인하기
$ wrangler login

# 빌드 명령 실행
$ npm run build

# 배포하기
$ npx wrangler pages deploy dist
```

배포 후 Cloudflare Pages 대시보드에는 해당 프로젝트가 나타나게 됩니다. 또한 Wrangler는 배포된 사이트를 검사할 수 있는 프리뷰 URL을 제공합니다.

### Git을 이용한 Cloudflare Pages 배포 {#cloudflare-pages-with-git}

1. Git 리포지토리(GitHub, GitLab)에 코드를 Push 합니다.
2. Cloudflare 대시보드에 접속한 뒤 **Account Home** > **Pages** 에서 계정을 선택합니다.
3. **Create a new Project** 및 **Connect Git** 옵션을 선택합니다.
4. 배포할 Git 프로젝트를 선택하고 **Begin setup** 을 클릭합니다.
5. 빌드 설정에서 Vite 프레임워크의 프리셋을 선택합니다.
6. 저장 후 배포합니다!
7. 애플리케이션이 배포되었습니다! (사이트는 `https://<PROJECTNAME>.pages.dev/`에서 볼 수 있습니다.)

프로젝트를 가져와 배포한 후, 해당 브랜치에 대한 모든 Push 동작은 [브랜치 빌드 컨트롤](https://developers.cloudflare.com/pages/platform/branch-build-controls/)에서 지정하지 않는 한 애플리케이션에 대한 [프리뷰 배포](https://developers.cloudflare.com/pages/platform/preview-deployments/)를 생성하게 됩니다. 프로덕션용 브랜치(일반적으로 "main")에 대한 모든 변경 사항은 [프로덕션 배포](https://developers.cloudflare.com/pages/platform/production-deployments/)가 됩니다.

커스텀 도메인을 추가하거나 커스텀 빌드 설정을 처리할 수도 있습니다. 자세한 내용은 [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site) 문서를 참고해 주세요.

## Google Firebase {#google-firebase}

1. [firebase-tools](https://www.npmjs.com/package/firebase-tools)가 설치되어 있는지 확인해주세요.

2. 아래와 같은 내용으로 프로젝트 루트에 `firebase.json` 및 `.firebaserc` 파일을 생성해주세요.

    ```json [firebase.json]
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

    ```js [.firebaserc]
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

## Azure 정적 웹 앱 {#azure-static-web-apps}

마이크로소프트 Azure 클라우드 서비스의 [Static Web Apps](https://aka.ms/staticwebapps) 서비스를 이용해 빠르게 Vite 앱을 배포할 수 있습니다.

- Azure 계정과 구독(Subscription) 키가 필요해요. [여기서 무료로 Azure 계정을 만들 수 있답니다](https://azure.microsoft.com/free).
- Vite 앱을 [GitHub](https://github.com)에 Push 해주세요.
- [Visual Studio Code](https://code.visualstudio.com)의 [SWA(Static Web Apps) 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)을 설치해주세요.

VS Code에 확장 프로그램을 설치한 뒤 앱의 루트 디렉터리로 들어가주세요. 이후 설치한 SWA 확장 프로그램을 실행하고, Azure에 로그인 한 뒤, '+' 버튼을 눌러 새로운 정적 웹 앱(Static Web App)을 만들어주세요. 여기서 앞서 생성한 구독 키를 설정하라는 메시지가 나오게 됩니다.

확장 프로그램을 통해 시작된 마법사를 따라 앱 이름을 지정하고, 프레임워크에 대한 사전 설정을 선택한 뒤, 앱 루트(일반적으로 `/`) 및 빌드된 파일 위치(`/dist`)를 지정해주세요. 마법사가 실행되며 `.github` 폴더의 저장소에 GitHub Actions가 구성됩니다.

새로이 구성된 GitHub Action은 앱 배포 시 동작하며(GitHub의 Actions 탭에서 확인할 수 있어요), 성공적으로 완료되면 확장 프로그램의 진행률 창에서 제공되는 'Browse Website' 버튼으로 배포된 앱을 볼 수 있게 됩니다.

## Render {#render}

[Render](https://render.com/)를 이용해 Vite 앱을 정적 웹 사이트로 배포할 수 있습니다.

1. [Render 계정](https://dashboard.render.com/register)을 생성합니다.

2. [대시보드](https://dashboard.render.com/)에서 **New** 버튼을 클릭한 뒤 **Static Site**를 선택합니다.

3. GitHub/GitLab 계정을 연결하거나, 공개 리포지토리를 사용합니다.

4. 프로젝트 이름과 브랜치를 지정합니다.
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Create Static Site**를 클릭합니다.

   앱은 `https://<PROJECTNAME>.onrender.com/` 경로로 배포됩니다.

기본적으로 지정된 브랜치에 새로운 커밋이 Push되면 자동으로 새로운 배포가 트리거됩니다. [자동 배포](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service)는 프로젝트 설정에서 구성할 수 있습니다.

프로젝트에 [커스텀 도메인](https://render.com/docs/custom-domains)을 추가할 수도 있습니다.

<!--
  NOTE: The sections below are reserved for more deployment platforms not listed above.
  Feel free to submit a PR that adds a new section with a link to your platform's
  deployment guide, as long as it meets these criteria:

  1. Users should be able to deploy their site for free.
  2. Free tier offerings should host the site indefinitely and are not time-bound.
     Offering a limited number of computation resource or site counts in exchange is fine.
  3. The linked guides should not contain any malicious content.

  The Vite team may change the criteria and audit the current list from time to time.
  If a section is removed, we will ping the original PR authors before doing so.
-->

## Flightcontrol {#flightcontrol}

[이 문서](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite)를 따라 [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite)을 이용해 정적 사이트를 배포할 수 있습니다.

## Kinsta 정적 사이트 호스팅 {#kinsta-static-site-hosting}

[이 문서](https://kinsta.com/docs/react-vite-example/)를 통해 [Kinsta](https://kinsta.com/static-site-hosting/)로 정적 사이트를 배포할 수 있습니다.

## xmit 정적 사이트 호스팅 {#xmit-static-site-hosting}

[xmit](https://xmit.co)를 사용하여 정적 사이트를 배포하려면 이 [가이드](https://xmit.dev/posts/vite-quickstart/)를 따라주세요.