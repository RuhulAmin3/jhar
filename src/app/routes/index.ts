import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { eventCategoryRoutes } from "../modules/EventCategory/EventCategory.routes";
import { eventRoutes } from "../modules/Event/Event.routes";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/event-category",
    route: eventCategoryRoutes,
  },
  {
    path: "/event",
    route: eventRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
