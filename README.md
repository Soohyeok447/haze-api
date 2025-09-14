# 헤이즈 (Haze)

[소켓이벤트 플로우차트 (draw.io)](https://tinyurl.com/3psuf8rh)

## 프로젝트 소개

**헤이즈(Haze)** 는 외모가 아닌 목소리와 대화에 먼저 집중하며 진솔한 관계를 맺는 새로운 소통 경험을 제공합니다. <br>
사용자는 프라이버시가 보호된 블러 화면으로 대화를 시작하고 상호 동의가 이루어졌을 때 비로소 선명한 화면으로 전환되어 안전하고 신뢰도 높은 만남을 유도하는 1:1 랜덤 화상채팅 플랫폼입니다.

<p align="center">
  <img src="https://github.com/user-attachments/assets/717bd804-cbc9-49a2-ab7f-4a3f4c503d04" alt="1" width="19%">
  &nbsp;
  <img src="https://github.com/user-attachments/assets/423dc570-0bdd-4db1-bb43-16900f07a63b" alt="2" width="19%">
  &nbsp;
  <img src="https://github.com/user-attachments/assets/fb263dc2-dc56-447e-80a3-784b6c7076e8" alt="3" width="19%">
  &nbsp;
  <img src="https://github.com/user-attachments/assets/acd4e111-df56-49c4-9f69-8efd425ade97" alt="4" width="19%">
</p>

<br>

## 기간

2023.09 - 2024.05 (8개월)

## 인원

프론트 1명, **백엔드 1명**, 디자인 1명 _(기획 1명이 잠시 참여했으나 중도 이탈)_

---

## 사용한 기술

- **인프라**
  - **AWS Lightsail** - MVP 단계에 적합한 비용 효율적인 서버를 구축하기 위해 채택
  - **AWS S3** - 유저 프로필 이미지를 DB에 저장하기 위해 S3를 사용
  - **AWS Cloudfront** - 메이드잇 프로젝트를 통해 깨달은 점을 통해 S3와의 연동으로 빠른 리소스 제공을 위해 사용
  - **Nginx (certbot)** - 대여한 도메인에 Https(SSL) 인증서 적용을 위해 웹서버와 Certbot 도구를 이용
- **CI/CD**
  - **Github Action** - CICD를 쉽게 관리하기 위해 사용
  - **Docker** - 컨테이너화를 통해 배포&관리를 빠르고 쉽게 하기 위해 사용
- **개발**
  - **Typescript** - AWS Lambda와 연계로 코드 안정성과 생산성 향상을 위해 사용
  - **Express** - MVP의 목표인 '빠른 프로토타이핑과 시장 검증' 을 위해, 최소한의 설정으로 핵심 기능 개발에만 집중할 수 있는 경량 프레임워크를 선택
  - **SocketIO** - WebRTC 시그널링과 실시간 매칭을 위한 WebSocket 구현 시, 신뢰성 높은 실시간 통신 라이브러리를 사용
- **DB**
  - **MongoDB Atlas** - 스키마 변경이 유연한 NoSQL의 장점을 활용해 빠르게 기능을 개선하고, DB 인프라 관리보다 핵심 로직 개발에 집중하기 위해 완전 관리형 서비스를 채택

## ERD
<img width="750" height="452" alt="Haze" src="https://github.com/user-attachments/assets/48a92847-b332-4761-9bc6-f330630156ad" />

## 시스템 아키텍쳐
<img width="834" height="626" alt="Haze" src="https://github.com/user-attachments/assets/0ed8664c-e4a3-43d4-8e36-55c96a66788e" />

## WAS 아키텍쳐
<img width="611" height="741" alt="Haze WAS" src="https://github.com/user-attachments/assets/55c0496d-b40d-43cf-a024-94d2430a8de7" />

## 소켓 파라미터 (Socket 인터페이스 확장)

실시간으로 변하는 사용자의 상태(`status`, `partnerSocket` 등)를 외부의 다른 데이터 구조(Map, Object)에서 관리할 경우 발생할 수 있는 조회 로직의 복잡성과 동기화 이슈를 해결하기 위해서 Socket.IO의 Socket 인터페이스를 의도적으로 확장하는 방식을 채택했습니다. <br><br>이를 통해 각 소켓 인스턴스가 자신의 상태 정보를 직접 갖게 하여 상태 조회 및 변경 로직을 단순화하고 코드의 직관성을 높였습니다.

```tsx
//socket.io.d.ts
import { Socket } from 'socket.io';

declare module 'socket.io' {
  interface Socket {
    status: 'idle' | 'waiting' | 'pending' | 'matched';
    nickName?: string;
    response?: 'accept' | null;
    partnerSocket?: Socket;
    partnerUserId?: string;
    partnerNickName?: string;
    room?: string;
    timeOut?: NodeJS.Timeout | null;
    faceRecognitionRequested?: boolean;
  }
}
```

## 핵심 기능

### 프라이버시 보호 매칭 시스템

- **블러 화면 시작**: 모든 매칭이 프라이버시 보호 블러 화면으로 시작
- **1:1 매칭**: 랜덤 연결
- **상호 동의 화면 전환**: 양방향 동의가 이루어져야만 선명한 화면으로 전환
- **Map 기반 대기열**: DB 조회 없이 메모리에서 O(1) 시간 복잡도로 사용자를 조회하고 상태를 변경하여, 매칭 시스템의 응답 속도를 단축하고 DB 부하를 최소화했습니다. 추후 Redis나 시그널링 서버 특성상 RDBMS까지 마이그레이션도 고려했습니다.

### WebRTC 시그널링 서버

- **P2P 화상 통화**: WebRTC Offer/Answer/ICE 교환을 통한 직접 연결
- **화면 전환 시그널링**: 블러 -> 선명 화면 전환을 위한 전용 시그널링 구현
- **STUN/TURN 연동**: 다양한 네트워크 환경에서의 P2P 연결 보장
- **타임아웃 관리**: 30초 매칭 대기 + 10초 화면 전환 요청 타임아웃

### 실시간 통신 시스템

- **Socket.IO 중앙집중 관리**: 매칭, WebRTC, 채팅, 관리자 이벤트 통합 처리
- **실시간 이벤트 처리**: 매칭부터 화면 전환까지 모든 실시간 상태 동기화

### 이미지 관리 시스템

- **AWS S3 연동**: 프로필 이미지 업로드 및 저장 자동화
- **이미지 최적화**: Sharp를 활용한 이미지 리사이징 및 최적화
- **메타데이터 관리**: 이미지 정보 데이터베이스 저장 및 관리

## 아키텍처 특징

### 기능 기반 서비스 분리

- **단일 책임 원칙**: `MatchingService`, `WebRTCService`, `SocketManager` 등 도메인별 클래스 분리
- **의존성 주입**: 서비스 간 느슨한 결합으로 유지보수성 확보

### WebRTC 시그널링 아키텍처

- **통합 시그널링 관리**: P2P 연결과 화면 전환 제어를 단일 서비스에서 처리
- **독창적 화면 전환**: 블러 -> 선명 전환을 WebRTC 시그널링에 통합
- **P2P 아키텍처**: 영상/음성 트래픽이 서버를 거치지 않도록 설계하여, 사용자가 증가하더라도 서버 트래픽 비용이 거의 늘어나지 않는 확장성 있는 구조를 완성했습니다. 이로 인해 MVP단계에서 과한 지출을 하지 않아도 됐습니다.

### 실시간 상태 관리

- **Map 기반 상태**: 사용자 대기열과 매칭 상태를 메모리에서 효율적 관리
- **원자적 상태 변경**: 동시성 문제 해결을 위한 명시적 상태 관리
- **이벤트 기반**: Socket.IO를 통한 실시간 상태 동기화

## 프로젝트 구조

```
src/
├── controllers/       # API 컨트롤러
│   └── dtos/         # 데이터 전송 객체
├── services/         # 비즈니스 로직
│   └── authStrategies/ # 인증 전략 패턴
├── repositories/     # 데이터 접근 계층
├── models/           # Mongoose 스키마 모델
├── routes/           # API 라우트 정의
├── middlewares/      # Express 미들웨어
├── exceptions/       # 커스텀 예외 클래스
│   ├── auth/         # 인증 관련 예외
│   ├── users/        # 사용자 관련 예외
│   ├── images/       # 이미지 관련 예외
│   └── blockLog/     # 차단 관련 예외
├── config/           # 설정 파일 (DB, S3, Swagger 등)
├── constants/        # 상수 정의 (이벤트, 상태 등)
├── types/            # TypeScript 타입 정의
└── public/           # 관리자 대시보드 정적 파일
```

## 주요 역할 (1인 백엔드 개발 및 인프라 구축)

### [**WebRTC와 Socket.IO 기반 실시간 P2P 화상채팅 구현**](https://soohyeok8901.notion.site/WebRTC-P2P-26b79b04d0dc802d869bfd6feb15dd78?source=copy_link)

서버 부하를 최소화하기 위해 **WebRTC의 P2P 방식**을 채택해서 실제 영상/음성 데이터는 클라이언트 간에 직접 통신하도록 설계했습니다. <br> 서버는 **Socket.IO**를 통해 연결을 중개하는 시그널링 역할만 담당하여 트래픽부하를 클라이언트가 담당하도록 했습니다.

### [**실시간 매칭 알고리즘 및 상태 관리 시스템 설계**](https://soohyeok8901.notion.site/26b79b04d0dc8071a092f7e7d68166b0?source=copy_link)

두 명의 사용자가 동시에 매칭될 때 발생하는 동시성 이슈를 해결하기 위해, 사용자의 상태를 `waiting` → `pending` → `matched`로 전환하는 명시적인 상태를 직접 설계하고 구현했습니다. <br>이를 통해 중복 매칭 버그를 원천적으로 방지하고 데이터 정합성을 확보했습니다.

### DevOps 및 AWS Lightsail 인프라 구축

**GitHub Actions**을 통해 코드 푸시 시 Docker 이미지 빌드 및 `self-hosted runner`가 설치된 **AWS Lightsail** 서버에 자동으로 배포되는 CI/CD 파이프라인을 구축했습니다. 이를 통해 월 평균 2만원 가량으로 안정적으로 MVP를 운영할 수 있었습니다.

### **고려했던 점 & 배운 점**

- **MVP 기술 스택 선택**<br>
  빠른 프로토타이핑과 시장 검증이 목표였기에, 구조가 강제되는 NestJS 대신 경량 프레임워크인 Express.js를 선택했습니다.<br> 이를 통해 복잡한 설정 없이 실시간 소켓 통신이라는 핵심 기능 개발에만 집중할 수 있었습니다.

- **동시성과 상태 관리**<br>
  `setInterval` 함수의 타이머를 제대로 해제하지 않아 **매칭 이벤트가 중복 발행되는 버그**를 직접 경험하고 해결했습니다. <br>이를 통해 실시간 비동기 환경에서는 **상태를 명시적으로, 그리고 원자적으로 관리하는 것**이 동시성 문제 해결의 핵심임을 깨달았습니다.

- **P2P 아키텍처 전략적 선택**<br>
  MVP 단계에서 서버 비용을 최소화하기 위해 **WebRTC의 P2P 아키텍처**를 채택했습니다. <br>이 과정에서 STUN/TURN 서버의 필요성 등 P2P 통신의 기술적 제약을 학습하고 **인프라 비용과 성능 사이의 트레이드오프를 경험**했습니다.

- **단일 서버의 한계와 확장성 고민**<br>
  현재 매칭 시스템은 서버 메모리의 Map 객체를 기반으로 동작하기에 서버 인스턴스가 하나일 때 가장 효율적입니다. <br>하지만 트래픽 증가로 서버를 여러 대로 확장할 경우, 각 서버가 가진 메모리 상태가 동기화되지 않는 문제가 발생합니다. <br>이 문제를 해결하기 위해, 향후 Redis와 같은 중앙 집중식 저장소를 도입하여 상태를 공유함으로써 여러 서버에서도 정합성을 유지하는 구조로의 확장을 염두했습니다.

### 관련 포스팅
- [WebRTC Signaling이란? - P2P 통신을 위한 개념](https://velog.io/@devshk447/WebRTC-Signaling%EC%9D%B4%EB%9E%80-P2P-%ED%86%B5%EC%8B%A0%EC%9D%84-%EC%9C%84%ED%95%9C-%EA%B0%9C%EB%85%90)


### **전체 요약 & 회고**

**Haze**는 WebRTC 기반의 실시간 P2P 화상채팅과 매칭 로직을 구현하며 발생하는 **비동기 흐름, 동시성 이슈, 상태 관리** 문제를 다루는 과정이었습니다. <br>
특히, 중복 매칭과 같은 동시성 문제를 방지하고자 어플리케이션 레벨에서 상태 관리 프로세스를 설계하고 적용하는 데 집중했습니다.
