export type InputType = 'xml' | 'json' | 'csv';

/**
 * Represents an ingest pipeline
 */
export interface Pipeline {
  /**
   * The pipeline identifier
   */
  id: number;

  /**
   * The pipeline code
   */
  code: string;

  /**
   * The pipeline input format
   * This can be XML, CSV etc.
   */
  inputType: InputType;

  /**
   * The pipeline script
   */
  script?: PipelineScript;

  /**
   * The pipeline tests
   */
  tests?: PipelineTest[];
}

/**
 * Represents a script
 */
export interface Script {
  /**
   * The language the script is written in
   */
  language: string;

  /**
   * The script code
   */
  body?: string;
}

export interface PipelineScript extends Script {
  /**
   * The script ID
   */
  id?: number;

  /**
   * The pipeline ID
   */
  pipelineId: number;

  /**
   * The user given script name
   */
  name?: string;

  /**
   * The script creation datetime
   */
  createdOn?: Date;

  /**
   * The script updated datetime
   */
  updatedOn?: Date;

  /**
   * The user who updated the script last
   */
  updatedBy: string;
}

/**
 * Represents a pipeline test
 */
export interface PipelineTest {
  /**
   * The test entity ID
   */
  id?: number;

  /**
   * The pipeline ID
   */
  pipelineId: number;

  /**
   * The creation datetime
   */
  createdOn?: Date;

  /**
   * The last user to update the test
   */
  updatedBy?: string;

  /**
   * The user defined test name
   */
  name?: string;

  /**
   * The test input
   */
  input?: string;

  /**
   * The expected test output
   */
  output?: string;
}

export interface CompilationError {
  row: number;
  column: number;
  message: string;
}

export interface PipelineTestResult {
  passed: boolean;
  output: string;
}

export interface PipelineTestRun {
  test: PipelineTest;
  result: PipelineTestResult;
}
