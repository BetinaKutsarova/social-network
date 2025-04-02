/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
	"setupFilesAfterEnv": [
    "<rootDir>/setupTest.ts"
  ],
	testEnvironment:"jsdom"

};