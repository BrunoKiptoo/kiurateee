
import { appVersion } from "../config/constants";
import categoriesRoutes from "./category.routes";
import videosRoutes from "./video.routes";
import pingRoutes from "./ping";

export default function initializeRoutes(app: { use: (arg0: string, arg1: any) => void }) {
  app.use(`/api/${appVersion}/ping`, pingRoutes);
  app.use(`/api/${appVersion}/categories`, categoriesRoutes);
  app.use(`/api/${appVersion}/videos`, videosRoutes);
}