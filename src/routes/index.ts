import { appVersion } from "../config/constants";
import categoriesRoutes from "./category.routes";
import videosRoutes from "./video.routes";
import pingRoutes from "./ping";
import AuthRoutes from "./auth.routes";
import FolderRoutes from "./folder.routes";
// import AdminRoutes from "./admin.routes";

export default function initializeRoutes(app: { use: (arg0: string, arg1: any) => void }) {
  app.use(`/api/${appVersion}/ping`, pingRoutes);
  app.use(`/api/${appVersion}/categories`, categoriesRoutes);
  app.use(`/api/${appVersion}/videos`, videosRoutes);
  app.use(`/api/${appVersion}/auth`, AuthRoutes);
  app.use(`/api/${appVersion}/folders`, FolderRoutes);
  // app.use(`/api/${appVersion}/admin`, AdminRoutes);
}
