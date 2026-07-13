import Docker from "dockerode";
import path from "path"
import fs from "fs"
import { PassThrough } from "stream"

const docker = new Docker();

interface ExecResult {
  exitCode: number,
  stdout: string,
  stderr: string
}

export const startContainer = async (workspaceId: string) => {
  try {
    const workspacePath = path.resolve(
      process.cwd(), "../../storage/workspace", workspaceId
    )
    const existingContainer = await getContainer(workspaceId);
    if (existingContainer) {
      const info = await existingContainer.inspect();
      if (!info.State.Running) {
        await existingContainer.start();
      }
      return existingContainer.id;
    }
    const container = await docker.createContainer({
      Image: "node:22-alpine",
      name: `workspace_${workspaceId}`,
      WorkingDir: "/workspace",
      Cmd: ["tail", "-f", "/dev/null"],
      HostConfig: {
        Binds: [`${workspacePath}:/workspace`],
        PortBindings: {
          "5173/tcp": [{ HostPort: "3001" }]
        }
      },
      ExposedPorts: {
        "5173/tcp": {}
      }
    })
    await container.start();

    return container.id;
  } catch (e) {
    console.log(e)
  }
};

export const getContainer = async (workspaceId: string): Promise<Docker.Container | null> => {
  const container = docker.getContainer(`workspace_${workspaceId}`)
  try {
    await container.inspect();
    return container;
  } catch (e) {
    return null;
  } finally {
    console.log("getcontainer")
  }
}

export const execCommand = async (
  workspaceId: string,
  command: string[]
): Promise<ExecResult> => {
  try {

    const container = await getContainer(workspaceId);

    if (!container) {
      throw new Error("Container not found")
    }
    const exec = await container.exec({
      Cmd: command,
      AttachStderr: true,
      AttachStdout: true,
      WorkingDir: "/workspace",
    })

    const stream = await exec.start({});
    let stdout = "";
    let stderr = "";

    const stdoutStream = new PassThrough();
    const stderrStream = new PassThrough();

    stdoutStream.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    stderrStream.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    docker.modem.demuxStream(
      stream,
      stdoutStream,
      stderrStream
    );
    await new Promise<void>((resolve, reject) => {
      stream.on("end", resolve);
      stream.on("error", reject);
    });
    const inspectData = await exec.inspect();
    return {
      exitCode: inspectData.ExitCode ?? -1,
      stdout,
      stderr,
    };

  } catch (e) {
    console.log(e)
    return {
      exitCode: -1,
      stderr: "",
      stdout: ""
    }
  }
}
export const execBackground = async (
  workspaceId: string,
  command: string[]
) => {
  const container = await getContainer(workspaceId);

  if (!container) {
    throw new Error("Container not found");
  }
  const exec = await container.exec({
    Cmd: command,
    AttachStdout: true,
    AttachStderr: true,
    WorkingDir: "/workspace"
  });
  const stream = await exec.start({});
  const stdoutStream = new PassThrough();
  const stderrStream = new PassThrough();
  docker.modem.demuxStream(
    stream,
    stdoutStream,
    stderrStream
  );

  stdoutStream.on("data", chunk => {
    console.log(chunk.toString());
  });

  stderrStream.on("data", chunk => {
    console.error(chunk.toString());
  });
  const inspect = await exec.inspect() ;

  return {
    execId: inspect.ID ? inspect.ID : exec.id,
  };
};


export const startWorkspaceServer = async (
  workspaceId: string
) => {

}


export const stopWorkspaceServer = async (
  workspaceId: string
) => {

}
