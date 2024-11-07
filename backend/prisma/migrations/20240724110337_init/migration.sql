/*
  Warnings:

  - You are about to drop the column `questionType` on the `Question` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Question" (
    "questionID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examID" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Question_examID_fkey" FOREIGN KEY ("examID") REFERENCES "Exam" ("examID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Question" ("createdAt", "examID", "questionID", "questionText", "updatedAt") SELECT "createdAt", "examID", "questionID", "questionText", "updatedAt" FROM "Question";
DROP TABLE "Question";
ALTER TABLE "new_Question" RENAME TO "Question";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
