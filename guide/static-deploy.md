# 정적 사이트 배포하기 {#deploying-a-static-site}

다음 가이드는 몇 가지 공통 가정을 기반으로 합니다:

- 기본 빌드 결과물 위치(`dist`)를 사용하고 있습니다. 이 위치는 [`build.outDir`을 사용하여 변경할 수 있으며](/config/build-options.md#build-outdir), 이 경우 이 가이드의 지침을 응용할 수 있습니다.
- npm을 사용하고 있습니다. Yarn 또는 다른 패키지 매니저를 사용하는 경우 동일한 역할의 명령을 사용해 스크립트를 실행할 수 있습니다.
- Vite는 프로젝트에 로컬 개발 디펜던시로 설치되어 있으며, 다음 npm 스크립트를 설정해 두었습니다:

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

`vite preview`는 빌드를 로컬에서 미리 확인하기 위한 용도이며, 프로덕션 서버로 사용하기 위한 것이 아니라는 점이 중요합니다.

::: tip NOTE
이 가이드는 Vite 사이트를 정적으로 배포하는 방법을 설명합니다. Vite는 Server-Side Rendering도 지원합니다. SSR은 동일한 애플리케이션을 Node.js에서 실행하고, 이를 HTML로 사전 렌더링한 뒤, 마지막으로 클라이언트에서 하이드레이션하는 것을 지원하는 프런트엔드 프레임워크를 의미합니다. 이 기능에 대해 알아보려면 [SSR 가이드](./ssr)를 확인하세요. 반면 기존 서버 사이드 프레임워크와의 통합을 찾고 있다면 [백엔드 통합 가이드](./backend-integration)를 확인하세요.
:::

## 앱 빌드하기 {#building-the-app}

`npm run build` 명령을 실행하여 앱을 빌드할 수 있습니다.

```bash
$ npm run build
```

기본적으로 빌드 결과물은 `dist`에 위치합니다. 이 `dist` 폴더를 원하는 플랫폼에 배포할 수 있습니다.

### 로컬에서 앱 테스트하기 {#testing-the-app-locally}

앱을 빌드한 후에는 `npm run preview` 명령을 실행하여 로컬에서 테스트할 수 있습니다.

```bash
$ npm run preview
```

`vite preview` 명령은 `dist`의 파일을 `http://localhost:4173`에서 제공하는 로컬 정적 웹 서버를 실행합니다. 로컬 환경에서 프로덕션 빌드가 괜찮아 보이는지 확인하기 쉬운 방법입니다.

`--port` 플래그를 인자로 전달하여 서버의 포트를 설정할 수 있습니다.

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

이제 `preview` 명령은 `http://localhost:8080`에서 서버를 실행합니다.

## GitHub Pages {#github-pages}

1. **Vite Config 업데이트**

   `vite.config.js`에서 올바른 `base`를 설정합니다.

   `https://<USERNAME>.github.io/` 또는 GitHub Pages를 통한 커스텀 도메인(예: `www.example.com`)에 배포하는 경우, `base`를 `'/'`로 설정하세요. 또는 기본값이 `'/'`이므로 설정에서 `base`를 제거할 수도 있습니다.

   `https://<USERNAME>.github.io/<REPO>/`에 배포하는 경우(예: 리포지토리가 `https://github.com/<USERNAME>/<REPO>`에 있는 경우), `base`를 `'/<REPO>/'`로 설정하세요.

2. **GitHub Pages 활성화**

   리포지토리에서 **Settings → Pages**로 이동합니다. **Build and deployment** 아래에서 **Source** 드롭다운을 열고 **GitHub Actions**를 선택합니다.

   이제 GitHub는 GitHub Actions [workflow](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)를 사용하여 사이트를 배포합니다. Vite는 배포를 위해 빌드 단계가 필요하므로 이 과정이 필요합니다.

3. **Workflow 생성**

   리포지토리의 `.github/workflows/deploy.yml`에 새 파일을 생성합니다. 이전 단계에서 **“create your own”**을 클릭할 수도 있으며, 그러면 시작용 workflow 파일이 생성됩니다.

   다음은 npm으로 디펜던시를 설치하고, 사이트를 빌드하며, `main` 브랜치에 변경 사항을 push할 때마다 배포하는 샘플 workflow입니다:

   <<< ./static-deploy-github-pages.yaml#content [.github/workflows/deploy.yml]

## GitLab Pages and GitLab CI {#gitlab-pages-and-gitlab-ci}

1. `vite.config.js`에서 올바른 `base`를 설정합니다.

   `https://<USERNAME or GROUP>.gitlab.io/`에 배포하는 경우, 기본값이 `'/'`이므로 `base`를 생략할 수 있습니다.

   `https://<USERNAME or GROUP>.gitlab.io/<REPO>/`에 배포하는 경우, 예를 들어 리포지토리가 `https://gitlab.com/<USERNAME>/<REPO>`에 있다면 `base`를 `'/<REPO>/'`로 설정하세요.

2. 프로젝트 루트에 아래 내용으로 `.gitlab-ci.yml` 파일을 생성합니다. 이 파일은 콘텐츠를 변경할 때마다 사이트를 빌드하고 배포합니다:

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

### Netlify CLI {#netlify-cli}

1. `npm install -g netlify-cli`를 통해 [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)를 설치합니다.
2. `netlify init`을 사용하여 새 사이트를 생성합니다.
3. `netlify deploy`를 사용하여 배포합니다.

Netlify CLI는 확인할 수 있는 프리뷰 URL을 공유합니다. 프로덕션으로 전환할 준비가 되면 `prod` 플래그를 사용하세요: `netlify deploy --prod`.

### Netlify with Git {#netlify-with-git}

1. 코드를 git 리포지토리(GitHub, GitLab, BitBucket, Azure DevOps)에 push합니다.
2. Netlify로 [프로젝트를 가져옵니다](https://app.netlify.com/start).
3. 브랜치와 결과물 디렉터리를 선택하고, 필요한 경우 환경 변수를 설정합니다.
4. **Deploy**를 클릭합니다.
5. Vite 앱이 배포되었습니다!

프로젝트를 가져오고 배포한 후, 프로덕션 브랜치가 아닌 브랜치에 대한 모든 후속 push와 pull request는 [Preview Deployments](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)를 생성하며, Production Branch(일반적으로 “main”)에 대한 모든 변경 사항은 [Production Deployment](https://docs.netlify.com/deploy/deploy-overview/#definitions)가 됩니다.

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. `npm i -g vercel`을 통해 [Vercel CLI](https://vercel.com/cli)를 설치하고 `vercel`을 실행하여 배포합니다.
2. Vercel은 Vite를 사용하고 있음을 감지하고 배포에 맞는 올바른 설정을 활성화합니다.
3. 애플리케이션이 배포되었습니다! (예: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

### Vercel with Git {#vercel-with-git}

1. 코드를 git 리포지토리(GitHub, GitLab, Bitbucket)에 push합니다.
2. Vercel로 [Vite 프로젝트를 가져옵니다](https://vercel.com/new).
3. Vercel은 Vite를 사용하고 있음을 감지하고 배포에 맞는 올바른 설정을 활성화합니다.
4. 애플리케이션이 배포되었습니다! (예: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

프로젝트를 가져오고 배포한 후, 브랜치에 대한 모든 후속 push는 [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview)를 생성하며, Production Branch(일반적으로 “main”)에 대한 모든 변경 사항은 [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production)가 됩니다.

Vercel의 [Git Integration](https://vercel.com/docs/concepts/git)에 대해 자세히 알아보세요.

## Cloudflare {#cloudflare}

### Cloudflare Workers {#cloudflare-workers}

[Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)은 Cloudflare Workers와의 통합을 제공하며, Vite의 Environment API를 사용하여 개발 중에 서버 사이드 코드를 Cloudflare Workers 런타임에서 실행합니다.

기존 Vite 프로젝트에 Cloudflare Workers를 추가하려면 플러그인을 설치하고 설정에 추가하세요:

```bash
$ npm install --save-dev @cloudflare/vite-plugin
```

```js [vite.config.js]
import { defineConfig } from 'vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [cloudflare()],
})
```

```jsonc [wrangler.jsonc]
{
  "name": "my-vite-app",
}
```

`npm run build`를 실행한 후에는 이제 `npx wrangler deploy`로 애플리케이션을 배포할 수 있습니다.

Cloudflare 리소스와 안전하게 통신하기 위해 Vite 애플리케이션에 백엔드 API를 쉽게 추가할 수도 있습니다. 이는 개발 중에는 Workers 런타임에서 실행되고, 프런트엔드와 함께 배포됩니다. 전체 안내는 [Cloudflare Vite plugin tutorial](https://developers.cloudflare.com/workers/vite-plugin/tutorial/)을 참고하세요.

### Cloudflare Pages {#cloudflare-pages}

#### Cloudflare Pages with Git {#cloudflare-pages-with-git}

Cloudflare Pages는 Wrangler 파일을 관리하지 않고도 Cloudflare에 직접 배포할 수 있는 방법을 제공합니다.

1. 코드를 git 리포지토리(GitHub, GitLab)에 push합니다.
2. Cloudflare 대시보드에 로그인하고 **Account Home** > **Workers & Pages**에서 계정을 선택합니다.
3. **Create a new Project**와 **Pages** 옵션을 선택한 뒤 Git을 선택합니다.
4. 배포할 git 프로젝트를 선택하고 **Begin setup**을 클릭합니다
5. 선택한 Vite 프레임워크에 따라 빌드 설정에서 해당 프레임워크 프리셋을 선택합니다. 그렇지 않으면 프로젝트의 빌드 명령과 예상 결과물 디렉터리를 입력합니다.
6. 그런 다음 저장하고 배포합니다!
7. 애플리케이션이 배포되었습니다! (예: `https://<PROJECTNAME>.pages.dev/`)

프로젝트를 가져오고 배포한 후, 브랜치에 대한 모든 후속 push는 [branch build controls](https://developers.cloudflare.com/pages/platform/branch-build-controls/)에서 생성하지 않도록 지정하지 않은 한 [Preview Deployments](https://developers.cloudflare.com/pages/platform/preview-deployments/)를 생성합니다. Production Branch(일반적으로 "main")에 대한 모든 변경 사항은 Production Deployment가 됩니다.

Pages에서 커스텀 도메인을 추가하고 커스텀 빌드 설정을 처리할 수도 있습니다. [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site)에 대해 자세히 알아보세요.

## Google Firebase {#google-firebase}

1. `npm i -g firebase-tools`를 통해 [firebase-tools](https://www.npmjs.com/package/firebase-tools)를 설치합니다.

2. 프로젝트 루트에 다음 파일을 생성합니다:

   ::: code-group

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

   :::

3. `npm run build`를 실행한 후, `firebase deploy` 명령을 사용하여 배포합니다.

## Surge {#surge}

1. `npm i -g surge`를 통해 [surge](https://www.npmjs.com/package/surge)를 설치합니다.
2. `npm run build`를 실행합니다.
3. `surge dist`를 입력하여 surge로 배포합니다.

`surge dist yourdomain.com`을 추가하여 [커스텀 도메인](https://surge.sh/help/adding-a-custom-domain)에 배포할 수도 있습니다.

## Azure Static Web Apps {#azure-static-web-apps}

Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) 서비스를 사용하여 Vite 앱을 빠르게 배포할 수 있습니다. 다음이 필요합니다:

- Azure 계정과 구독 키가 필요합니다. [여기에서 무료 Azure 계정을 만들 수 있습니다](https://azure.microsoft.com/free).
- 앱 코드가 [GitHub](https://github.com)에 push되어 있어야 합니다.
- [Visual Studio Code](https://code.visualstudio.com)에 [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)이 필요합니다.

VS Code에 확장을 설치하고 앱 루트로 이동합니다. Static Web Apps 확장을 열고 Azure에 로그인한 뒤, '+' 기호를 클릭하여 새 Static Web App을 생성합니다. 사용할 구독 키를 지정하라는 메시지가 표시됩니다.

확장이 시작한 마법사를 따라 앱 이름을 지정하고, 프레임워크 프리셋을 선택하며, 앱 루트(일반적으로 `/`)와 빌드된 파일 위치 `/dist`를 지정합니다. 마법사가 실행되며 리포지토리의 `.github` 폴더에 GitHub action을 생성합니다.

이 action은 앱을 배포하기 위해 동작하며(리포지토리의 Actions 탭에서 진행 상황을 확인할 수 있습니다), 성공적으로 완료되면 GitHub action이 실행된 후 표시되는 'Browse Website' 버튼을 클릭하여 확장의 진행 창에 제공된 주소에서 앱을 볼 수 있습니다.

## Render {#render}

[Render](https://render.com/)에서 Vite 앱을 Static Site로 배포할 수 있습니다.

1. [Render 계정](https://dashboard.render.com/register)을 생성합니다.

2. [Dashboard](https://dashboard.render.com/)에서 **New** 버튼을 클릭하고 **Static Site**를 선택합니다.

3. GitHub/GitLab 계정을 연결하거나 공개 리포지토리를 사용합니다.

4. 프로젝트 이름과 브랜치를 지정합니다.
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Create Static Site**를 클릭합니다. 앱은 `https://<PROJECTNAME>.onrender.com/`에 배포됩니다.

기본적으로 지정한 브랜치에 새 커밋이 push되면 새 배포가 자동으로 트리거됩니다. [Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service)는 프로젝트 설정에서 구성할 수 있습니다.

프로젝트에 [커스텀 도메인](https://render.com/docs/custom-domains)을 추가할 수도 있습니다.

## Flightcontrol {#flightcontrol}

이 [instructions](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite)를 따라 [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite)을 사용하여 정적 사이트를 배포하세요.

## Kinsta Static Site Hosting {#kinsta-static-site-hosting}

이 [instructions](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite)를 따라 [Kinsta](https://kinsta.com/static-site-hosting/)를 사용하여 정적 사이트를 배포하세요.

## xmit Static Site Hosting {#xmit-static-site-hosting}

이 [guide](https://xmit.dev/posts/vite-quickstart/)를 따라 [xmit](https://xmit.co)을 사용하여 정적 사이트를 배포하세요.

## Zephyr Cloud {#zephyr-cloud}

[Zephyr Cloud](https://zephyr-cloud.io)는 빌드 프로세스에 직접 통합되고 module federation 및 다른 종류의 애플리케이션을 위한 글로벌 엣지 배포를 제공하는 배포 플랫폼입니다.

Zephyr는 다른 클라우드 제공자와 다른 접근 방식을 따릅니다. Vite 빌드 프로세스에 직접 통합되므로 애플리케이션을 빌드하거나 개발 서버를 실행할 때마다 Zephyr Cloud로 자동 배포됩니다.

시작하려면 [Vite 배포 가이드](https://docs.zephyr-cloud.io/bundlers/vite)의 단계를 따르세요.

## EdgeOne Pages {#edgeone-pages}

이 [instructions](https://pages.edgeone.ai/document/vite)를 따라 [EdgeOne Pages](https://edgeone.ai/products/pages)를 사용하여 정적 사이트를 배포하세요.
