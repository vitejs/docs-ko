<!--
  새로운 배포 플랫폼을 추가하려면 이 내용을 읽어주세요.

  아래 기준을 충족한다면, 플랫폼의 배포 가이드 링크가 포함된 새 섹션을
  추가하는 PR을 자유롭게 보내주세요:

  1. 사용자가 사이트를 무료로 배포할 수 있어야 합니다.
  2. 무료 티어는 사이트를 기간 제한 없이 계속 호스팅할 수 있어야 합니다.
     대신 제한된 컴퓨팅 리소스나 사이트 개수를 제공하는 것은 괜찮습니다.
  3. 링크된 가이드에는 악성 콘텐츠가 없어야 합니다.

  새 섹션은 파일 맨 아래에 추가해야 합니다. 새 섹션 형식 예시는
  이 파일 아래쪽의 기존 섹션을 참고해 주세요.

  Vite 팀은 기준을 변경하고 현재 목록을 수시로 감사할 수 있습니다.
  섹션을 제거하는 경우, 제거 전에 원래 PR 작성자에게 알립니다.
-->

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
이 가이드는 Vite 기반의 사이트를 정적(Static)으로 배포하기 위한 방법을 설명하고 있습니다. 물론 Vite는 서버 측 렌더링(SSR, Server Side Rendering)을 지원합니다. 참고로 '서버 측 렌더링'이란, Node.js를 이용해 동일한 웹 애플리케이션을 HTML로 사전에 렌더링한 뒤, 이를 클라이언트에게 제공하는 방식의 프런트엔드 프레임워크를 의미합니다. 이에 대해 더 알고자 한다면 [SSR 가이드](./ssr)를 참고해주세요. 만약 기존에 사용하고 있는 서버측 프레임워크(Ror, Laravel 등)가 있다면, [백엔드 통합 가이드](./backend-integration)를 참고해주세요.
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

1. **Vite 설정 업데이트**

   `vite.config.js`에서 올바른 `base`를 설정합니다.

    만약 GitHub Pages를 통해 `https://<USERNAME>.github.io/`이나 커스텀 도메인(예: `www.example.com`)에 배포하고자 한다면, `base` 설정값을 `'/'`로 지정해 주세요. 또는 `base`의 기본값이 `'/'`이기 때문에 설정에서 `base`를 제거해도 됩니다.

   만약 `https://<USERNAME>.github.io/<REPO>/`와 같은 형태로 배포하고자 한다면(예: 리포지토리가 `https://github.com/<USERNAME>/<REPO>`인 경우), `base` 설정값을 `'/<REPO>/'`로 지정해 주세요.

2. **GitHub Pages 활성화**

   리포지토리에서 **Settings → Pages**로 이동합니다. **Build and deployment** 아래의 **Source** 드롭다운을 열고 **GitHub Actions**를 선택합니다.

   이제 GitHub는 GitHub Actions [워크플로](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows)를 사용해 사이트를 배포합니다. Vite는 배포를 위해 빌드 단계가 필요하므로 이 과정이 필요합니다.

3. **워크플로 생성**

   리포지토리에 `.github/workflows/deploy.yml` 파일을 새로 만듭니다. 이전 단계에서 **“create your own”**을 클릭하면 시작용 워크플로 파일을 생성할 수도 있습니다.

   다음은 `main` 브랜치에 변경 사항을 push할 때마다 npm으로 디펜던시를 설치하고, 사이트를 빌드하고, 배포하는 샘플 워크플로입니다:

   <<< ./static-deploy-github-pages.yaml#content [배포 워크플로]

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

### Netlify CLI {#netlify-cli}

1. `npm install -g netlify-cli`로 [Netlify CLI](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)를 설치합니다.
2. `netlify init`으로 새 사이트를 생성합니다.
3. `netlify deploy`로 배포합니다.

Netlify CLI는 확인할 수 있는 프리뷰 URL을 제공합니다. 프로덕션으로 전환할 준비가 되면 `prod` 플래그를 사용하세요: `netlify deploy --prod`.

### Git으로 Netlify 사용하기 {#netlify-with-git}

1. 코드를 Git 리포지토리(GitHub, GitLab, BitBucket, Azure DevOps)에 Push 해주세요.
2. Netlify에서 [프로젝트를 불러와주세요](https://app.netlify.com/start).
3. 배포될 브랜치를 선택하고, 빌드 결과물이 들어갈 디렉터리와 필요하다면 환경 변수를 설정해주세요.
4. **Deploy** 를 클릭해주세요.
5. Vite 앱이 배포되었습니다!

프로젝트를 가져오고 배포한 뒤에는 프로덕션 브랜치가 아닌 브랜치로의 모든 push와 pull request가 [프리뷰 배포](https://docs.netlify.com/deploy/deploy-types/deploy-previews/)를 생성하며, 프로덕션 브랜치(일반적으로 “main”)에 대한 모든 변경 사항은 [프로덕션 배포](https://docs.netlify.com/deploy/deploy-overview/#definitions)가 됩니다.

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. `npm i -g vercel`로 [Vercel CLI](https://vercel.com/cli)를 설치하고, `vercel`을 실행해 배포합니다.
2. Vercel은 Vite를 사용하고 있음을 감지하게 되며, 배포와 관련된 올바른 설정을 활성화합니다.
3. 애플리케이션이 배포되었습니다! (예시: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

### Git으로 Vercel 사용하기 {#vercel-with-git}

1. 사용하고 있는 Git 리포지토리(GitHub, GitLab, Bitbucket)으로 소스 코드를 Push 합니다.
2. Vercel로 [Vite 프로젝트를 가져옵니다](https://vercel.com/new).
3. Vercel은 Vite를 사용하고 있음을 감지하게 되며, 배포와 관련된 올바른 설정을 활성화합니다.
4. 애플리케이션이 배포되었습니다! (예시: [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

Vercel로 프로젝트를 불러오고 배포까지 완료했다면, 이후 브랜치에 대한 모든 Push 동작은 애플리케이션에 대한 [프리뷰 배포](https://vercel.com/docs/concepts/deployments/environments#preview)를 생성하게 됩니다. 그리고 프로덕션용 브랜치(일반적으로 "main")에 대한 모든 변경 사항은 [프로덕션 배포](https://vercel.com/docs/concepts/deployments/environments#production)가 됩니다.

이에 대해 좀 더 알고 싶다면 Vercel의 [Git](https://vercel.com/docs/concepts/git) 문서를 참고해주세요.

## Cloudflare {#cloudflare}

### Cloudflare Workers {#cloudflare-workers}

[Cloudflare Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/)은 Cloudflare Workers와의 통합을 제공하며, 개발 중 Vite의 Environment API를 사용해 서버 측 코드를 Cloudflare Workers 런타임에서 실행합니다.

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

`npm run build`를 실행한 뒤, `npx wrangler deploy`로 애플리케이션을 배포할 수 있습니다.

Cloudflare 리소스와 안전하게 통신하기 위해 Vite 애플리케이션에 백엔드 API를 쉽게 추가할 수도 있습니다. 이는 개발 중 Workers 런타임에서 실행되고 프런트엔드와 함께 배포됩니다. 전체 단계는 [Cloudflare Vite plugin 튜토리얼](https://developers.cloudflare.com/workers/vite-plugin/tutorial/)을 참고해 주세요.

### Cloudflare Pages {#cloudflare-pages}

#### Git으로 Cloudflare Pages 사용하기 {#cloudflare-pages-with-git}

Cloudflare Pages는 Wrangler 파일을 관리하지 않고도 Cloudflare에 직접 배포할 수 있는 방법을 제공합니다.

1. Git 리포지토리(GitHub, GitLab)에 코드를 Push 합니다.
2. Cloudflare 대시보드에 로그인하고 **Account Home** > **Workers & Pages**에서 계정을 선택합니다.
3. **Create a new Project**와 **Pages** 옵션을 선택한 뒤 Git을 선택합니다.
4. 배포할 Git 프로젝트를 선택하고 **Begin setup** 을 클릭합니다.
5. 선택한 Vite 프레임워크에 따라 빌드 설정에서 해당 프레임워크 프리셋을 선택합니다. 그렇지 않다면 프로젝트의 빌드 명령과 예상 출력 디렉터리를 입력합니다.
6. 저장 후 배포합니다!
7. 애플리케이션이 배포되었습니다! (사이트는 `https://<PROJECTNAME>.pages.dev/`에서 볼 수 있습니다.)

프로젝트를 가져오고 배포한 뒤에는 [브랜치 빌드 제어](https://developers.cloudflare.com/pages/platform/branch-build-controls/)에서 달리 지정하지 않는 한 브랜치로의 모든 후속 push가 [프리뷰 배포](https://developers.cloudflare.com/pages/platform/preview-deployments/)를 생성합니다. 프로덕션 브랜치(일반적으로 "main")에 대한 모든 변경 사항은 프로덕션 배포가 됩니다.

커스텀 도메인을 추가하거나 커스텀 빌드 설정을 처리할 수도 있습니다. 자세한 내용은 [Cloudflare Pages Git Integration](https://developers.cloudflare.com/pages/get-started/#manage-your-site) 문서를 참고해 주세요.

## Google Firebase {#google-firebase}

1. `npm i -g firebase-tools`로 [firebase-tools](https://www.npmjs.com/package/firebase-tools)를 설치합니다.

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

3. `npm run build` 명령을 먼저 실행하고, 그 다음 `firebase deploy` 명령을 통해 배포가 가능합니다.

## Surge {#surge}

1. `npm i -g surge`로 [surge](https://www.npmjs.com/package/surge)를 설치합니다.
2. `npm run build` 명령을 실행해주세요.
3. `surge dist` 명령을 통해 Surge로 배포해주세요.

`surge dist yourdomain.com`을 추가해 [커스텀 도메인](https://surge.sh/help/adding-a-custom-domain)으로도 배포할 수 있습니다.

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
   - **빌드 명령**: `npm install && npm run build`
   - **게시 디렉터리**: `dist`

5. **Create Static Site**를 클릭합니다. 앱은 `https://<PROJECTNAME>.onrender.com/`에 배포됩니다.

기본적으로 지정된 브랜치에 새로운 커밋이 Push되면 자동으로 새로운 배포가 트리거됩니다. [자동 배포](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service)는 프로젝트 설정에서 구성할 수 있습니다.

프로젝트에 [커스텀 도메인](https://render.com/docs/custom-domains)을 추가할 수도 있습니다.

## Flightcontrol {#flightcontrol}

[이 문서](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite)를 따라 [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite)을 이용해 정적 사이트를 배포할 수 있습니다.

## Kinsta 정적 사이트 호스팅 {#kinsta-static-site-hosting}

이 [안내](https://kinsta.com/docs/static-site-hosting/static-site-quick-start/react-static-site-examples/#react-with-vite)를 따라 [Kinsta](https://kinsta.com/static-site-hosting/)로 정적 사이트를 배포할 수 있습니다.

## xmit 정적 사이트 호스팅 {#xmit-static-site-hosting}

[xmit](https://xmit.co)를 사용하여 정적 사이트를 배포하려면 이 [가이드](https://xmit.dev/posts/vite-quickstart/)를 따라주세요.

## Zephyr Cloud {#zephyr-cloud}

[Zephyr Cloud](https://zephyr-cloud.io)는 빌드 프로세스에 직접 통합되며, 모듈 페더레이션 및 다른 종류의 애플리케이션을 위한 글로벌 엣지 배포를 제공하는 배포 플랫폼입니다.

Zephyr는 다른 클라우드 제공자와 다른 접근 방식을 따릅니다. Vite 빌드 프로세스와 직접 통합되므로, 애플리케이션을 빌드하거나 개발 서버를 실행할 때마다 Zephyr Cloud로 자동 배포됩니다.

시작하려면 [Vite 배포 가이드](https://docs.zephyr-cloud.io/bundlers/vite)의 단계를 따르세요.

## EdgeOne Pages {#edgeone-pages}

이 [안내](https://pages.edgeone.ai/document/vite)를 따라 [EdgeOne Pages](https://edgeone.ai/products/pages)로 정적 사이트를 배포할 수 있습니다.
