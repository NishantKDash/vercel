"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const generator_1 = __importDefault(require("./generator"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    origin: "http://localhost:5000",
}));
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const repoUrl = req.body.repoUrl;
        console.log(repoUrl);
        const id = (0, generator_1.default)();
        yield (0, simple_git_1.default)().clone(repoUrl, `./output/${id}`);
        res.json({ message: "Repository uploaded" });
    }
    catch (e) {
        console.log(e);
        res.json({ error: "Internal Server Error" });
    }
}));
app.listen(port, () => {
    console.log(`Server started at ${port}`);
});
