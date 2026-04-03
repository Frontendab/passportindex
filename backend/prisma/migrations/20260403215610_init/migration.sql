-- CreateTable
CREATE TABLE "Passport" (
    "id" TEXT NOT NULL,
    "name_passport" TEXT NOT NULL,
    "cover" TEXT NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaRequirement" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visa_type" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,

    CONSTRAINT "VisaRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passport_name_passport_key" ON "Passport"("name_passport");

-- AddForeignKey
ALTER TABLE "VisaRequirement" ADD CONSTRAINT "VisaRequirement_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "Passport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
