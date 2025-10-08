# Repository Layer Documentation

This directory contains the data access layer (repositories) for the Jump Rope Training Management Platform. Each repository provides a clean interface to interact with IndexedDB through Dexie.

## Repository Pattern

All repositories follow a consistent pattern with:
- **CRUD operations**: Create, Read, Update, Delete
- **Query methods**: Filtering and searching data
- **Aggregation methods**: Counting and summarizing data
- **Business logic methods**: Domain-specific operations

## Common Methods

All repositories implement these standard methods:

### Core CRUD
- `upsert(entity)` / `save(entity)` - Create or update an entity
- `get(id)` / `findById(id)` - Get a single entity by ID
- `list()` / `getAll()` - Get all entities
- `remove(id)` / `delete(id)` - Delete an entity by ID

### Utility
- `exists(id)` - Check if an entity exists
- `count()` - Get total count of entities

## Available Repositories

### 1. templatesRepo
Manages training templates.

**Additional Methods:**
- `listByPeriod(period)` - Get templates by training period (PREP, SPEC, COMP)

**Usage:**
```typescript
import { templatesRepo } from './store/repositories/templatesRepo';

// Create/update a template
const template = await templatesRepo.save({
  id: 'template-1',
  name: 'Speed Training',
  period: 'SPEC',
  blocks: [...],
  createdAt: new Date().toISOString()
});

// Get all templates for a specific period
const specTemplates = await templatesRepo.listByPeriod('SPEC');

// Check if template exists
const exists = await templatesRepo.exists('template-1');
```

### 2. classesRepo
Manages class entities.

**Additional Methods:**
- `setTemplate(classId, template)` - Set or clear class template
- `addStudent(classId, studentId)` - Add a student to a class
- `removeStudent(classId, studentId)` - Remove a student from a class

**Usage:**
```typescript
import { classesRepo } from './store/repositories/classesRepo';

// Create a class
const classEntity = await classesRepo.save({
  id: 'class-1',
  name: 'Beginner Class',
  coachName: 'Coach Zhang',
  studentIds: []
});

// Add students to the class
await classesRepo.addStudent('class-1', 'student-1');
await classesRepo.addStudent('class-1', 'student-2');

// Set the default template
await classesRepo.setTemplate('class-1', template);
```

### 3. studentsRepo
Manages student records.

**Additional Methods:**
- `wallet(studentId)` - Get student's lesson wallet
- `updateRank(studentId, rank)` - Update student's rank
- `addPoints(studentId, points)` - Add points to student's total
- `addBadge(studentId, badge)` - Award a badge to a student
- `listByRank(rank)` - Get all students with a specific rank

**Usage:**
```typescript
import { studentsRepo } from './store/repositories/studentsRepo';

// Create a student
const student = await studentsRepo.save({
  id: 'student-1',
  name: 'Li Ming',
  gender: 'M',
  currentRank: 1,
  pointsTotal: 0,
  badges: []
});

// Update rank after passing exam
await studentsRepo.updateRank('student-1', 2);

// Award points and badges
await studentsRepo.addPoints('student-1', 10);
await studentsRepo.addBadge('student-1', 'first-double-jump');

// Get lesson wallet
const wallet = await studentsRepo.wallet('student-1');
console.log(`Remaining lessons: ${wallet.remaining}`);
```

### 4. sessionsRepo
Manages training session records.

**Additional Methods:**
- `listByClass(classId)` - Get all sessions for a class (newest first)
- `closeSession(sessionId)` - Mark a session as closed
- `listClosedByClass(classId)` - Get closed sessions for a class
- `listOpenByClass(classId)` - Get open (active) sessions for a class
- `countByClass(classId)` - Count sessions for a specific class

**Usage:**
```typescript
import { sessionsRepo } from './store/repositories/sessionsRepo';

// Create a session
const session = await sessionsRepo.save({
  id: 'session-1',
  classId: 'class-1',
  date: new Date().toISOString(),
  attendance: [],
  speed: [],
  freestyle: [],
  notes: [],
  closed: false
});

// Close the session
await sessionsRepo.closeSession('session-1');

// Get all sessions for a class
const sessions = await sessionsRepo.listByClass('class-1');
```

### 5. testsRepo
Manages fitness test results.

**Additional Methods:**
- `listByStudent(studentId)` - Get all tests for a student (oldest first)
- `listByQuarter(quarter)` - Get tests for a specific quarter (e.g., "2025Q1")
- `getLatestByStudent(studentId)` - Get the most recent test for a student
- `countByStudent(studentId)` - Count tests for a specific student

**Usage:**
```typescript
import { testsRepo } from './store/repositories/testsRepo';

// Record a fitness test
const test = await testsRepo.save({
  id: 'test-1',
  studentId: 'student-1',
  quarter: '2025Q1',
  date: new Date().toISOString(),
  items: [...],
  radar: { speed: 75, power: 68, ... }
});

// Get the latest test for a student
const latestTest = await testsRepo.getLatestByStudent('student-1');

// Get all tests for a quarter
const q1Tests = await testsRepo.listByQuarter('2025Q1');
```

### 6. billingRepo
Manages financial operations including lesson packages and payments.

**Additional Methods:**
- `addPackage(pkg, payment)` - Add a lesson package with payment (transactional)
- `paymentsByStudent(studentId)` - Get payment history for a student
- `packagesByStudent(studentId)` - Get lesson packages for a student
- `wallet(studentId)` - Get student's lesson wallet
- `financeKpis()` - Calculate financial KPIs (revenue, ARPU, consume rate, etc.)
- `getPackage(id)` - Get a single lesson package
- `getPayment(id)` - Get a single payment record
- `listAllPackages()` - Get all lesson packages
- `listAllPayments()` - Get all payment records
- `paymentsByDateRange(startDate, endDate)` - Filter payments by date range
- `revenueByDateRange(startDate, endDate)` - Calculate revenue for a date range
- `removePackage(id)` - Delete a lesson package
- `removePayment(id)` - Delete a payment record

**Usage:**
```typescript
import { billingRepo } from './store/repositories/billingRepo';

// Student purchases a lesson package
await billingRepo.addPackage(
  {
    id: 'pkg-1',
    studentId: 'student-1',
    purchasedLessons: 20,
    price: 3600,
    unitPrice: 180,
    purchasedAt: new Date().toISOString()
  },
  {
    id: 'payment-1',
    studentId: 'student-1',
    packageId: 'pkg-1',
    amount: 3600,
    method: 'wechat',
    paidAt: new Date().toISOString()
  }
);

// Get student's lesson wallet
const wallet = await billingRepo.wallet('student-1');
console.log(`Purchased: ${wallet.totalPurchased}, Consumed: ${wallet.totalConsumed}, Remaining: ${wallet.remaining}`);

// Get financial KPIs
const kpis = await billingRepo.financeKpis();
console.log(`Total Revenue: ${kpis.totalRevenue}`);
console.log(`ARPU: ${kpis.arpu}`);
console.log(`Consume Rate: ${kpis.consumeRate}%`);

// Get revenue for a date range
const monthRevenue = await billingRepo.revenueByDateRange(
  '2025-01-01',
  '2025-01-31'
);
```

## Error Handling

Some methods throw errors when entities are not found:
- `classesRepo.addStudent()` - throws if class doesn't exist
- `classesRepo.removeStudent()` - throws if class doesn't exist
- `studentsRepo.addPoints()` - throws if student doesn't exist
- `studentsRepo.addBadge()` - throws if student doesn't exist

Always wrap these calls in try-catch blocks:

```typescript
try {
  await classesRepo.addStudent('class-1', 'student-1');
} catch (error) {
  console.error('Failed to add student:', error.message);
}
```

## Transaction Support

Some operations use Dexie transactions to ensure data consistency:
- `billingRepo.addPackage()` - adds both package and payment in a single transaction

## Best Practices

1. **Use alias methods for clarity**: Use `save()` instead of `upsert()`, `findById()` instead of `get()`, etc.
2. **Check existence before operations**: Use `exists()` to avoid unnecessary database queries
3. **Use specific query methods**: Use `listByClass()`, `listByStudent()`, etc. instead of `getAll()` with manual filtering
4. **Handle errors**: Wrap operations that can throw in try-catch blocks
5. **Use transactions**: For operations that modify multiple tables, use the transactional methods

## Future Enhancements

When connecting to a REST API backend:
1. Keep the repository interfaces unchanged
2. Create new implementations (e.g., `templatesRepoRest`)
3. Use feature flags or configuration to switch between IndexedDB and REST
4. Maintain the same method signatures for seamless transition

## Related Files

- `src/store/db.ts` - Dexie database schema
- `src/store/repositories/wallet.ts` - Wallet calculation logic
- `src/types/models.ts` - TypeScript type definitions
