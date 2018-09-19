import * as br from 'bump-regex';

export class GpsSemver {
    public bumper(text: string, level: string) {
        return new Promise<string>((resolve, reject) => {
            var bumped = "";
            try {
                this.GetVersion(text)
                    .then((res) => {
                        var version = {
                            str: text,
                            type: level
                        };

                        return new Promise<string>((resolve, reject) => {
                            this.bump(version)
                                .then((newVersion) => {
                                    resolve(newVersion);
                                })
                                .catch((error) => {
                                    reject(error);
                                });
                        }).catch((e) => {
                            throw e;
                        }).then((results) => {
                            resolve(results);
                        });
                    })
                    .catch((e) => {
                        reject(e);
                    });
            }
            catch (err) {
                reject(err);
            }
        });
    }

    private bump(options: any) {
        return new Promise<string>((resolve, reject) => {
            br(options, (err: any, newVersion: any) => {
                if (!err) {
                    resolve(newVersion.str);
                } else {
                    reject(err.message);
                }
            });

        });
    }

    private GetVersion(text: string) {
        return new Promise<string>((resolve, reject) => {
            if (text) {
                resolve(text);
            } else { 
                reject("Text cannot be empty or nothing."); 
            }
        });
    }
}

