import Loading from "components/loading/Loading";
import React, { createContext, useContext, useState, useEffect } from "react";
import useDatabase from "../hooks/useDatabase";

const AuthContext = createContext<any>(null);

export function useAuth(): {
  setCurrentUser: React.Dispatch<any>;
  currentUser: any;
  currentSchool: any;
  currentSeason: any;
  changeCurrentSeason: (season: any) => void;
  currentRegistration: any;
  registrations: any;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserProfile: React.Dispatch<any>;
  deleteUserProfile: React.Dispatch<any>;
  currentNotifications: any;
  setCurrentNotifications: React.Dispatch<any>;
  currentPermission: any;
} {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const database = useDatabase();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentSchool, setCurrentSchool] = useState<any>();
  const [registrations, setRegistration] = useState<any>([]);
  console.log(
    "🚀 ~ file: authContext.tsx ~ line 25 ~ AuthProvider ~ registrations",
    registrations
  );
  const [currentRegistration, setCurrentRegistration] = useState<any>();
  const [currentSeason, setCurrentSeason] = useState<any>();
  const [currentNotifications, setCurrentNotifications] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPermission, setCurrentPermission] = useState<any>({});

  async function getLoggedInUser() {
    const res = await database.R({
      location: "users/current",
    });
    /**
     * sets the current user
     */
    setCurrentUser(res);
    setCurrentSchool(res.schools[0]);
    setCurrentNotifications(res.notifications);

    /** if there is a registration, set the season */
    if (res.registrations) {
      setRegistration(res.registrations);
      setCurrentRegistration(res.registrations[0]);
      changeCurrentSeason(res.registrations[0]);
    }

    return res;
  }

  useEffect(() => {
    loading &&
      getLoggedInUser()
        .then(() => {
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
  }, [loading]);

  async function changeCurrentSeason(registration: any) {
    setCurrentRegistration(registration);
    const result = await database
      .R({
        location: `seasons/${registration?.season}`,
      })
      .then((res) => {
        setCurrentSeason(res);
      })
      .catch(() => {});
    return result;
  }

  const checkPermission = (permission: any) => {
    for (let i = 0; i < permission?.length; i++) {
      if (
        permission[i][0] === "userId" &&
        permission[i][1] === currentUser?.userId
      ) {
        return permission[i][2];
      }
      if (
        permission[i][0] === "role" &&
        permission[i][1] === currentRegistration?.role
      )
        return permission[i][2];
    }
    return false;
  };

  useEffect(() => {
    const permission = {
      permissionSyllabus: false,
      permissionEnrollment: false,
      permissionEvaluation: false,
      permissionNotification: false,
    };

    // permissionSyllabus
    if (checkPermission(currentSeason?.permissionSyllabus))
      permission["permissionSyllabus"] = true;

    // permissionEnrollment
    if (checkPermission(currentSeason?.permissionEnrollment))
      permission["permissionEnrollment"] = true;

    // permissionEvaluation
    if (checkPermission(currentSeason?.permissionEvaluation))
      permission["permissionEvaluation"] = true;

    // permissionNotification?
    if (checkPermission(currentSeason?.permissionNotification))
      permission["permissionNotification"] = true;

    setCurrentPermission(permission);
  }, [currentSeason]);

  const updateUserProfile = (profile: string) => {
    setCurrentUser({ ...currentUser, profile });
  };
  const deleteUserProfile = () => {
    setCurrentUser({ ...currentUser, profile: undefined });
  };

  const value = {
    setCurrentUser,
    currentUser,
    loading,
    currentSeason,
    registrations,
    changeCurrentSeason,
    currentRegistration,
    setLoading,
    currentSchool,
    updateUserProfile,
    deleteUserProfile,
    currentNotifications,
    setCurrentNotifications,
    currentPermission,
  };
  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <Loading height={"100vh"} />}
    </AuthContext.Provider>
  );
};
