import { useEffect } from "react";
import {
  Account,
  Client,
  ID,
  Avatars,
  Databases,
  Storage,
  Query,
} from "react-native-appwrite";
export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.aora.appwrite",
  projectId: "661eeae85bb09be2ff9f",
  databaseId: "661eec975d86062d3bab",
  userCollectionId: "661eecd75d64463ecb33",
  videoCollectionId: "661eed0c745a6c41ab23",
  storageId: "661eeed988e55cd8bc98",
};

// Init your react-native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
export const createUser = async (email, password, username) => {
  try {
    console.log("working34");

    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    );
    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);
    console.log("working54");
    await signIn(email, password);
    console.log("working3s");

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      },
    );
    console.log("working4s");

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
// Register User
export const signIn = async (email, password) => {
  try {
    console.log("working1");
    // const existingSession = await account.getSession("current");
    // if (existingSession) {
    //   await account.deleteSession("current");
    //   console.log("working2");
    // }
    console.log("email", email, " password", password);
    console.log("workingtemp");
    const session = await account.createEmailPasswordSession(email, password);
    console.log("working3");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};
