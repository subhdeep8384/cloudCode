import express, { type Request, type Response } from "express"
import multer from "multer"
import path from "node:path";
import fs from "node:fs"
import unzipper from "unzipper"
import { startObjectSyncWorker } from "./process/syncObjectStoreAndFileSystem.worker.js";
import { saveProgress, uploadTemplateOfProject } from "./process/syncInR2.js";
const app = express() ;

const uploadDir = path.join(process.cwd(), "uploads");
const extractDir = path.join(process.cwd(), "extracted");

fs.mkdirSync(uploadDir, { recursive: true });
fs.mkdirSync(extractDir, { recursive: true });

const upload = multer({
    dest: uploadDir,
    limits: {
        fileSize: 500 * 1024 * 1024 // 500 MB
    }
});

//all workers here 
startObjectSyncWorker();
saveProgress()


app.post(
    "/sync",
    upload.single("workspace"),
    async (req: Request, res: Response) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "ZIP file missing"
                });
            }

            const workspaceId = path
                .parse(req.file.originalname)
                .name;

            const workspaceExtractPath = path.join(
                extractDir,
                workspaceId
            );

            fs.mkdirSync(workspaceExtractPath, {
                recursive: true
            });

            // Extract ZIP
            await fs.createReadStream(req.file.path)
                .pipe(unzipper.Extract({
                    path: workspaceExtractPath
                }))
                .promise();

            // Remove temporary ZIP
            fs.unlinkSync(req.file.path);

            console.log("Workspace received:", workspaceId);

            return res.json({
                success: true,
                workspaceId,
                message: "Workspace extracted successfully"
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Workspace extraction failed"
            });
        }
    }
);
app.listen(4000, () => {
    console.log("Worker receiving server running on port 4000");
});

