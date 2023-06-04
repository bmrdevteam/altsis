/**
 * @file uesAPIv2 hook
 *
 *
 * @author <jessie129j@gmail.com>
 *
 */

import useDatabase from "hooks/useDatabase";

import { MESSAGE } from "./_message";
import { TAcademy } from "types/academies";
import { TAdmin } from "types/users";
import _ from "lodash";
import { TCurrentUser } from "types/auth";

function QUERY_BUILDER(params?: object) {
  let query = "";
  if (params) {
    query = "?";
    for (const [key, value] of Object.entries(params)) {
      query = query.concat(`${key}=${value}&`);
    }
  }
  return query;
}

export const ALERT_ERROR = (err: any) => {
  let message = "";
  if (err.response?.data?.message) {
    message += MESSAGE.get(err.response.data.message) ?? "";
    if (message === "") {
      message += MESSAGE.get("UNKNOWN");
      message += `\n\nstatus: ${err.response.status}`;
      message += `\nmessage: ${err.response.data.message}`;
    }
  } else {
    message += MESSAGE.get("UNKNOWN");
  }
  alert(message);
};

export default function useAPIv2() {
  const database = useDatabase();

  /**
   * API FUNCTIONS
   */

  /**
   * ##########################################################################
   * Academy API
   * ##########################################################################
   */

  /**
   * CAcademy API
   * 아카데미 생성 API
   * @auth owner
   * @returns academy
   * @returns admin
   */
  async function CAcademy(props: {
    data: {
      academyId: string;
      academyName: string;
      adminId: string;
      adminName: string;
      email?: string;
      tel?: string;
    };
  }) {
    const { academy, admin } = await database.C({
      location: `academies`,
      data: props.data,
    });
    return {
      academy: academy as TAcademy,
      admin: admin as TAdmin,
    };
  }

  /**
   * RAcademy API
   * 아카데미 조회 API
   * @auth not-logged-in user
   * @returns academy
   */

  async function RAcademy(props: {
    query: {
      academyId: string;
    };
  }) {
    const { academy } = await database.R({
      location: `academies` + QUERY_BUILDER(props.query),
    });
    return {
      academy: academy as TAcademy,
    };
  }

  /**
   * RAcademies API
   * 아카데미 목록 조회 API
   * @auth owner
   * @returns academies
   */

  async function RAcademies() {
    const { academies } = await database.R({
      location: `academies`,
    });
    return {
      academies: academies as TAcademy[],
    };
  }

  /**
   * UAcademyEmail API
   * 아카데미 이메일 변경 API
   * @auth owner
   * @returns academies
   */

  async function UAcademyEmail(props: {
    params: {
      academyId: string;
    };
    data: {
      email?: string;
    };
  }) {
    const { academy } = await database.U({
      location: `academies/${props.params.academyId}/email`,
      data: props.data,
    });
    return {
      academy: academy as TAcademy,
    };
  }

  /**
   * UAcademyTel API
   * 아카데미 전화번호 변경 API
   * @auth owner
   * @returns academies
   */

  async function UAcademyTel(props: {
    params: {
      academyId: string;
    };
    data: {
      tel?: string;
    };
  }) {
    const { academy } = await database.U({
      location: `academies/${props.params.academyId}/tel`,
      data: props.data,
    });
    return {
      academy: academy as TAcademy,
    };
  }

  /**
   * UActivateAcademy API
   * 아카데미 활성화 API
   * @auth owner
   * @returns academy
   */
  async function UActivateAcademy(props: {
    params: {
      academyId: string;
    };
  }) {
    const { academy } = await database.U({
      location: `academies/${props.params.academyId}/activate`,
      data: {},
    });
    return {
      academy: academy as TAcademy,
    };
  }

  /**
   * UInactivateAcademy API
   * 아카데미 비활성화 API
   * @auth owner
   * @returns academy
   */
  async function UInactivateAcademy(props: {
    params: {
      academyId: string;
    };
  }) {
    const { academy } = await database.U({
      location: `academies/${props.params.academyId}/inactivate`,
      data: {},
    });
    return {
      academy: academy as TAcademy,
    };
  }

  /**
   * DAcademy API
   * 아카데미 삭제 API
   * @auth owner
   */
  async function DAcademy(props: {
    params: {
      academyId: string;
    };
  }) {
    await database.D({
      location: `academies/${props.params.academyId}`,
    });
    return {};
  }

  /**
   * ##########################################################################
   * User API
   * ##########################################################################
   */

  /**
   * LoginLocal API
   * 로컬 로그인 API
   * @auth guest
   */
  async function LoginLocal(props: {
    data: {
      academyId: string;
      userId: string;
      password: string;
      persist?: boolean;
    };
  }) {
    return await database.C({
      location: "users/login/local",
      data: props.data,
    });
  }

  /**
   * LoginGoogle API
   * 구글 로그인 API
   * @auth guest
   */
  async function LoginGoogle(props: {
    data: {
      academyId: string;
      credential: string;
      persist?: boolean;
    };
  }) {
    return await database.C({
      location: "users/login/google",
      data: props.data,
    });
  }

  /**
   * Logout API
   * 로그아웃 API
   * @auth user
   */
  async function Logout() {
    return await database.R({
      location: "users/logout",
    });
  }

  /**
   * ConnectGoogleByAdmin API
   * 구글 로그인 활성화 API
   * @auth admin
   */
  async function ConnectGoogleByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      email: string;
    };
  }) {
    const { snsId } = await database.U({
      location: `users/${props.params.uid}/google`,
      data: props.data,
    });

    return { snsId: snsId as { google?: string } };
  }

  /**
   * DisconnectGoogleByAdmin API
   * 구글 로그인 비활성화 API
   * @auth admin
   */
  async function DisconnectGoogleByAdmin(props: {
    params: {
      uid: string;
    };
  }) {
    const { snsId } = await database.D({
      location: `users/${props.params.uid}/google`,
    });

    return { snsId: snsId as { google?: string } };
  }

  /**
   * UAuthByAdmin API
   * 등급 변경 API
   * @auth admin
   */
  async function UAuthByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      auth: "manager" | "member";
    };
  }) {
    const { auth } = await database.U({
      location: `users/${props.params.uid}/auth`,
      data: props.data,
    });

    return { auth: auth as "member" | "manager" };
  }

  /**
   * UEmailByAdmin API
   * 등급 변경 API
   * @auth admin
   */
  async function UEmailByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      email: string;
    };
  }) {
    const { email } = await database.U({
      location: `users/${props.params.uid}/email`,
      data: props.data,
    });

    return { email: email as string };
  }

  /**
   * UTelByAdmin API
   * 전화번호 변경 API
   * @auth admin
   */
  async function UTelByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      tel: string;
    };
  }) {
    const { tel } = await database.U({
      location: `users/${props.params.uid}/tel`,
      data: props.data,
    });

    return { tel: tel as string };
  }

  /**
   * UPasswordByAdmin API
   * 비밀번호 변경 API
   * @auth admin
   */
  async function UPasswordByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      password: string;
    };
  }) {
    return await database.U({
      location: `users/${props.params.uid}/password`,
      data: props.data,
    });
  }

  /**
   * CUserSchoolByAdmin API
   * 소속 학교 추가 API
   * @auth admin
   */
  async function CUserSchoolByAdmin(props: {
    params: {
      uid: string;
    };
    data: {
      sid: string;
    };
  }) {
    const { schools } = await database.C({
      location: `users/${props.params.uid}/schools`,
      data: props.data,
    });
    return {
      schools: schools as {
        school: string;
        schoolId: string;
        schoolName: string;
      }[],
    };
  }

  /**
   * DUserSchoolByAdmin API
   * 소속 학교 삭제 API
   * @auth admin
   */
  async function DUserSchoolByAdmin(props: {
    params: {
      uid: string;
    };
    query: {
      sid: string;
    };
  }) {
    const { schools } = await database.D({
      location:
        `users/${props.params.uid}/schools` + QUERY_BUILDER(props.query),
    });
    return {
      schools: schools as {
        school: string;
        schoolId: string;
        schoolName: string;
      }[],
    };
  }

  /**
   * CUserByAdmin API
   * 사용자 생성 API
   * @auth admin
   */
  async function CUserByAdmin(props: {
    data: {
      schools: { school: string }[];
      auth: "member" | "manager";
      userId: string;
      userName: string;
      password: string;
      tel?: string;
      email?: string;
      snsId?: {
        google?: string;
      };
    };
  }) {
    const { user } = await database.C({
      location: `users`,
      data: props.data,
    });
    return {
      user,
    };
  }

  /**
   * RUsers API
   * 사용자 목록 조회 API
   * @auth owner|admin|manager
   */
  async function RUsers(props: {
    query?: {
      sid?: string; // school objectId
      academyId?: string; // required for owner
    };
  }) {
    const { users } = await database.R({
      location: `users` + QUERY_BUILDER(props.query),
    });
    return {
      users: _.orderBy(users, ["userName", "userId"], ["asc", "asc"]),
    };
  }

  /**
   * RUser API
   * 사용자 조회 API
   * @auth owner|admin|manager
   */
  async function RUser(props: {
    params: {
      _id: string; // user objectId
    };
    query?: {
      academyId?: string; // required for owner
    };
  }) {
    const { user } = await database.R({
      location: `users/${props.params._id}` + QUERY_BUILDER(props.query),
    });
    return {
      user,
    };
  }

  /**
   * DUser API
   * 사용자 삭제 API
   * @auth admin
   */
  async function DUser(props: {
    params: {
      _id: string; // user objectId
    };
  }) {
    return await database.D({
      location: `users/${props.params._id}`,
    });
  }

  /**
   * RMySelf API
   * 사용자 본인 조회 API
   * @auth user
   */
  async function RMySelf() {
    const { user, registrations } = await database.R({
      location: `users/current`,
    });

    user.registrations = _.orderBy(
      registrations,
      [(reg) => reg?.period?.end ?? ""],
      ["desc"]
    );

    return { user: user as TCurrentUser };
  }

  return {
    AcademyAPI: {
      CAcademy,
      RAcademy,
      RAcademies,
      UAcademyEmail,
      UAcademyTel,
      UActivateAcademy,
      UInactivateAcademy,
      DAcademy,
    },
    UserAPI: {
      LoginLocal,
      LoginGoogle,
      Logout,
      ConnectGoogleByAdmin,
      DisconnectGoogleByAdmin,
      UAuthByAdmin,
      UEmailByAdmin,
      UTelByAdmin,
      UPasswordByAdmin,
      CUserSchoolByAdmin,
      DUserSchoolByAdmin,
      CUserByAdmin,
      RUsers,
      RUser,
      DUser,
      RMySelf,
    },
  };
}
