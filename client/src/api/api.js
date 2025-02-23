import axios from "axios";

const BASE_URL = "http://localhost:8080"; // バックエンドのURL

export const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // セッション情報を送るため必須
});

export const login = async (email, password) => {
    return api.post("/auth/local/login", { mail_address: email, password });
};

export const fetchDialects = async () => {
    return api.get("/dialects"); // 認証情報を送るため、`api.js` 内の `withCredentials: true` を利用
};

export const fetchQuestsByDialect = async (dialectId) => {
    return api.get(`/dialects/${dialectId}/quests`);
};

export const fetchQuestDetails = async (questId) => {
    return api.get(`/quests/${questId}`);
};

export const submitAnswer = async (questId, answerId) => {
    console.log("送信するデータ:", { answer: answerId }); // IDを送る
    return api.post(`/quests/${questId}/answer`, { answer: answerId });
  };
  
  export const fetchUserData = async (userId) => {
    return api.get(`/users/${userId}/profile`);
};
