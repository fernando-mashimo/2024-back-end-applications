
export class FindKeepWatchingQuery {
    id: string;

    watchedAt: string;

    watchedTimeInSeconds: string;

    videoId: string;

    videoName: string;

    videoThumb: string;

    videoLink: string;

    categoryId: string;

    categoryTitle: string;

    categoryIcon: string;

    professionalId: string;

    professionalName: string;

    professionalSurname: string;

    professionalPhoto: string;

    professionalSocial: string;

    professionalCref: string;
}

/**
 * wv."id",
        wv."watchedAt",
        wv."watchedTimeInSecond" as "watchedTimeInSeconds",
        v."name" as "videoName",
        v."thumb" as "videoThumb",
        v."link" as "videoLink",
        c."id" as "categoryId",
        c."title" as "categoryTitle",
        c."icon" as "categoryIcon",
        p."id" as "professionalId",
        a."name" as "professionalName",
        a."surname" as "professionalSurname",
        a."photo" as "professionalPhoto",
        p."social" as "professionalSocial",
        p."cref" as "professionalCref"
 */