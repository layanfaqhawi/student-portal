-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Grade" (
    "gradeID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentID" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "assignmentID" INTEGER,
    "examID" INTEGER,
    "released" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Grade_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "Student" ("studentID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Grade_assignmentID_fkey" FOREIGN KEY ("assignmentID") REFERENCES "Assignment" ("assignmentID") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Grade_examID_fkey" FOREIGN KEY ("examID") REFERENCES "Exam" ("examID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Grade" ("assignmentID", "createdAt", "examID", "grade", "gradeID", "studentID", "type", "updatedAt") SELECT "assignmentID", "createdAt", "examID", "grade", "gradeID", "studentID", "type", "updatedAt" FROM "Grade";
DROP TABLE "Grade";
ALTER TABLE "new_Grade" RENAME TO "Grade";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
