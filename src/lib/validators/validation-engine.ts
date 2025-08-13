import { Client, Worker, Task, ValidationError } from '@/types/data.types';
import { runAIValidation } from './ai-validators';

export class ValidationEngine {
  private errors: ValidationError[] = [];

  async validateAll(data: { clients: Client[], workers: Worker[], tasks: Task[] }) {
    this.errors = [];
    
    // Core validations
    this.validateMissingColumns(data);
    this.validateDuplicateIds(data);
    this.validateDataFormats(data);
    this.validateReferences(data);
    this.validateBusinessLogic(data);
    
    // AI-powered validations
    const aiErrors = await runAIValidation(data);
    this.errors.push(...aiErrors);
    
    return this.errors;
  }

  private validateMissingColumns(data: any) {
    const requiredFields = {
      clients: ['ClientID', 'ClientName', 'PriorityLevel'],
      workers: ['WorkerID', 'WorkerName', 'Skills', 'AvailableSlots'],
      tasks: ['TaskID', 'TaskName', 'Duration', 'RequiredSkills']
    };
    
    Object.entries(requiredFields).forEach(([entityType, fields]) => {
      const items = data[entityType];
      if (!items || items.length === 0) return;
      
      fields.forEach(field => {
        const hasField = items.every((item: any) => 
          item.hasOwnProperty(field) && item[field] !== null && item[field] !== undefined
        );
        
        if (!hasField) {
          this.errors.push({
            type: 'MISSING_COLUMN',
            severity: 'error',
            entity: entityType as any,
            entityId: 'all',
            field,
            message: `Missing required field: ${field}`,
            suggestion: `Add ${field} column to your ${entityType} data`
          });
        }
      });
    });
  }

  private validateDuplicateIds(data: any) {
    const checkDuplicates = (items: any[], idField: string, entityType: string) => {
      const ids = new Set();
      items.forEach(item => {
        if (ids.has(item[idField])) {
          this.errors.push({
            type: 'DUPLICATE_ID',
            severity: 'error',
            entity: entityType as any,
            entityId: item[idField],
            field: idField,
            message: `Duplicate ${idField}: ${item[idField]}`,
            suggestion: `Change ${idField} to ensure uniqueness`
          });
        }
        ids.add(item[idField]);
      });
    };
    
    checkDuplicates(data.clients, 'ClientID', 'client');
    checkDuplicates(data.workers, 'WorkerID', 'worker');
    checkDuplicates(data.tasks, 'TaskID', 'task');
  }

  private validateDataFormats(data: any) {
    // Validate PriorityLevel (1-5)
    data.clients.forEach((client: Client) => {
      if (client.PriorityLevel < 1 || client.PriorityLevel > 5) {
        this.errors.push({
          type: 'OUT_OF_RANGE',
          severity: 'error',
          entity: 'client',
          entityId: client.ClientID,
          field: 'PriorityLevel',
          message: `PriorityLevel must be between 1-5, got ${client.PriorityLevel}`,
          suggestion: 'Set PriorityLevel to a value between 1 and 5'
        });
      }
    });

    // Validate Duration >= 1
    data.tasks.forEach((task: Task) => {
      if (task.Duration < 1) {
        this.errors.push({
          type: 'INVALID_DURATION',
          severity: 'error',
          entity: 'task',
          entityId: task.TaskID,
          field: 'Duration',
          message: `Duration must be >= 1, got ${task.Duration}`,
          suggestion: 'Set Duration to at least 1'
        });
      }
    });

    // Validate AvailableSlots
    data.workers.forEach((worker: Worker) => {
      if (!Array.isArray(worker.AvailableSlots)) {
        this.errors.push({
          type: 'MALFORMED_LIST',
          severity: 'error',
          entity: 'worker',
          entityId: worker.WorkerID,
          field: 'AvailableSlots',
          message: 'AvailableSlots must be an array of numbers',
          suggestion: 'Format as [1, 2, 3] or similar'
        });
      } else if (worker.AvailableSlots.some(slot => typeof slot !== 'number')) {
        this.errors.push({
          type: 'MALFORMED_LIST',
          severity: 'error',
          entity: 'worker',
          entityId: worker.WorkerID,
          field: 'AvailableSlots',
          message: 'AvailableSlots contains non-numeric values',
          suggestion: 'Ensure all slot values are numbers'
        });
      }
    });

    // Validate JSON fields
    data.clients.forEach((client: Client) => {
      if (client.AttributesJSON && typeof client.AttributesJSON === 'string') {
        try {
          JSON.parse(client.AttributesJSON);
        } catch {
          this.errors.push({
            type: 'BROKEN_JSON',
            severity: 'error',
            entity: 'client',
            entityId: client.ClientID,
            field: 'AttributesJSON',
            message: 'Invalid JSON in AttributesJSON',
            suggestion: 'Fix JSON syntax or use valid JSON format'
          });
        }
      }
    });
  }

  private validateReferences(data: any) {
    const taskIds = new Set(data.tasks.map((t: Task) => t.TaskID));
    const workerSkills = new Set(
      data.workers.flatMap((w: Worker) => w.Skills)
    );

    // Validate RequestedTaskIDs
    data.clients.forEach((client: Client) => {
      client.RequestedTaskIDs.forEach(taskId => {
        if (!taskIds.has(taskId)) {
          this.errors.push({
            type: 'UNKNOWN_REFERENCE',
            severity: 'error',
            entity: 'client',
            entityId: client.ClientID,
            field: 'RequestedTaskIDs',
            message: `Unknown task reference: ${taskId}`,
            suggestion: `Remove ${taskId} or add it to tasks`
          });
        }
      });
    });

    // Validate RequiredSkills coverage
    data.tasks.forEach((task: Task) => {
      task.RequiredSkills.forEach(skill => {
        if (!workerSkills.has(skill)) {
          this.errors.push({
            type: 'SKILL_COVERAGE',
            severity: 'warning',
            entity: 'task',
            entityId: task.TaskID,
            field: 'RequiredSkills',
            message: `No worker has required skill: ${skill}`,
            suggestion: `Add workers with ${skill} or remove requirement`
          });
        }
      });
    });
  }

  private validateBusinessLogic(data: any) {
    // Validate worker overload
    data.workers.forEach((worker: Worker) => {
      if (worker.AvailableSlots.length < worker.MaxLoadPerPhase) {
        this.errors.push({
          type: 'OVERLOADED_WORKER',
          severity: 'warning',
          entity: 'worker',
          entityId: worker.WorkerID,
          message: `Worker has fewer slots (${worker.AvailableSlots.length}) than MaxLoadPerPhase (${worker.MaxLoadPerPhase})`,
          suggestion: 'Increase available slots or reduce MaxLoadPerPhase'
        });
      }
    });

    // Validate max concurrency feasibility
    data.tasks.forEach((task: Task) => {
      const qualifiedWorkers = data.workers.filter((worker: Worker) =>
        task.RequiredSkills.every(skill => worker.Skills.includes(skill))
      );
      
      if (task.MaxConcurrent > qualifiedWorkers.length) {
        this.errors.push({
          type: 'MAX_CONCURRENCY_INFEASIBLE',
          severity: 'warning',
          entity: 'task',
          entityId: task.TaskID,
          field: 'MaxConcurrent',
          message: `MaxConcurrent (${task.MaxConcurrent}) exceeds qualified workers (${qualifiedWorkers.length})`,
          suggestion: `Reduce MaxConcurrent to ${qualifiedWorkers.length} or less`
        });
      }
    });

    // Phase-slot saturation check
    const phaseLoads = new Map<number, number>();
    data.tasks.forEach((task: Task) => {
      task.PreferredPhases.forEach(phase => {
        const currentLoad = phaseLoads.get(phase) || 0;
        phaseLoads.set(phase, currentLoad + task.Duration);
      });
    });

    phaseLoads.forEach((load, phase) => {
      const availableSlots = data.workers.reduce((sum: number, worker: Worker) => 
        sum + (worker.AvailableSlots.includes(phase) ? 1 : 0), 0
      );
      
      if (load > availableSlots) {
        this.errors.push({
          type: 'PHASE_SLOT_SATURATION',
          severity: 'warning',
          entity: 'task',
          entityId: 'all',
          message: `Phase ${phase} is overloaded: ${load} task units vs ${availableSlots} worker slots`,
          suggestion: 'Redistribute tasks across phases or add more workers'
        });
      }
    });
  }
}