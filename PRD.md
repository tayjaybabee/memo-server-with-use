# Planning Guide

A collaborative memo application where users can create, organize, and manage personal notes with user authentication and persistent storage.

**Experience Qualities**:
1. **Efficient** - Quick note capture with minimal friction, allowing users to jot down thoughts instantly
2. **Personal** - User-specific memo spaces with GitHub authentication providing a sense of ownership
3. **Organized** - Clear visual hierarchy and categorization making it easy to find and manage memos

**Complexity Level**: Light Application (multiple features with basic state)
This is a memo management system with user authentication, CRUD operations, and persistent storage - more than a single-purpose tool but not requiring complex multi-view navigation or advanced state orchestration.

## Essential Features

### User Authentication
- **Functionality**: Display current GitHub user identity and ownership status
- **Purpose**: Personalize the experience and establish memo ownership
- **Trigger**: Automatic on app load
- **Progression**: App loads → Fetch user info → Display avatar and username in header
- **Success criteria**: User sees their GitHub avatar and login name prominently displayed

### Access Control & Whitelist
- **Functionality**: Owner can whitelist specific GitHub usernames to control who can access the memo server
- **Purpose**: Restrict access to trusted users while maintaining GitHub-based authentication
- **Trigger**: Owner navigates to Settings tab
- **Progression**: Owner clicks Settings → Views whitelist → Adds GitHub username → User is granted access → Non-whitelisted users see access denied screen
- **Success criteria**: Only whitelisted users (plus owner) can view and create memos; non-whitelisted users see a clear access denied message

### Memo Creation
- **Functionality**: Create new text-based memos with title and content
- **Purpose**: Capture thoughts, reminders, and notes quickly
- **Trigger**: Click "New Memo" button
- **Progression**: Click new memo → Dialog opens → Enter title and content → Save → Memo appears in list → Toast confirmation
- **Success criteria**: New memo persists and appears immediately in the memo list

### Memo List View
- **Functionality**: Display all user memos in a scrollable grid with preview
- **Purpose**: Overview of all saved memos for quick scanning
- **Trigger**: Automatic on app load
- **Progression**: App loads → Fetch memos from KV store → Render grid of memo cards
- **Success criteria**: All memos display with title, preview text, and timestamp

### Memo Editing
- **Functionality**: Modify existing memo title and content
- **Purpose**: Update and refine notes over time
- **Trigger**: Click edit icon on memo card
- **Progression**: Click edit → Dialog opens with current content → Modify fields → Save → Memo updates → Toast confirmation
- **Success criteria**: Changes persist and display immediately without page refresh

### Memo Deletion
- **Functionality**: Remove unwanted memos permanently
- **Purpose**: Keep memo list relevant and uncluttered
- **Trigger**: Click delete icon on memo card
- **Progression**: Click delete → Confirmation dialog appears → Confirm → Memo removed → Toast confirmation
- **Success criteria**: Memo disappears from list and is permanently deleted from storage

### Search and Filter
- **Functionality**: Filter memos by title or content text
- **Purpose**: Quickly locate specific memos in large collections
- **Trigger**: Type in search input field
- **Progression**: Enter search term → List filters in real-time → Matching memos highlighted
- **Success criteria**: Only memos containing search term remain visible

## Edge Case Handling
- **Empty State**: Display welcoming illustration and "Create your first memo" prompt when no memos exist
- **Long Content**: Truncate memo previews with ellipsis and show full content in edit dialog
- **Rapid Creation**: Debounce save operations to prevent duplicate memo creation
- **No Results**: Show "No memos found" message when search returns empty
- **Invalid Input**: Require title field, show inline validation for empty submissions
- **Access Denied**: Non-whitelisted users see a clear, friendly access denied screen with owner contact suggestion
- **Empty Whitelist**: When no users are whitelisted, anyone can access the memo server (open access mode)
- **Owner Always Has Access**: App owner bypasses whitelist restrictions and can always access all features

## Design Direction
The design should evoke a sense of modern productivity - clean, focused, and slightly playful. It should feel like a premium note-taking tool with personality, not a sterile database interface. The aesthetic should be warm and inviting while maintaining professional clarity.

## Color Selection
A warm, energetic palette that feels modern and creative without being overwhelming.

- **Primary Color**: Deep Plum (oklch(0.35 0.12 310)) - Communicates sophistication and focus, used for primary actions and key interactive elements
- **Secondary Colors**: 
  - Soft Lavender (oklch(0.92 0.04 310)) - Subtle backgrounds for cards and sections
  - Warm Cream (oklch(0.98 0.01 60)) - Main background, creating warmth
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 25)) - Attention-grabbing color for CTAs, new memo button, and important interactions
- **Foreground/Background Pairings**: 
  - Primary (Deep Plum oklch(0.35 0.12 310)): White text (oklch(0.98 0.01 60)) - Ratio 8.2:1 ✓
  - Accent (Vibrant Coral oklch(0.68 0.18 25)): White text (oklch(0.98 0.01 60)) - Ratio 4.9:1 ✓
  - Background (Warm Cream oklch(0.98 0.01 60)): Dark Slate text (oklch(0.25 0.02 280)) - Ratio 12.1:1 ✓
  - Card (Soft Lavender oklch(0.92 0.04 310)): Dark Slate text (oklch(0.25 0.02 280)) - Ratio 10.5:1 ✓

## Font Selection
Typefaces should balance readability with character - modern and slightly quirky to match the warm, creative aesthetic while maintaining professional utility.

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold/32px/tight letter spacing (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/20px/normal spacing
  - H3 (Memo Titles): Space Grotesk Medium/18px/normal spacing
  - Body (Memo Content): Inter Regular/15px/relaxed line height (1.6)
  - Small (Timestamps, Labels): Inter Medium/13px/normal spacing
  - Button Text: Space Grotesk Medium/14px/slight letter spacing (0.01em)

## Animations
Animations should feel responsive and snappy while adding moments of delight during memo creation and interactions.

- **Memo Card Hover**: Subtle lift with shadow increase (transform translateY -2px, duration 200ms)
- **Create/Edit Dialog**: Scale and fade entrance from center (spring physics, slight overshoot)
- **Delete Action**: Fade out and scale down simultaneously (300ms ease-out)
- **Toast Notifications**: Slide in from bottom-right with gentle bounce
- **Search Results**: Stagger fade-in for filtered memos (50ms delay between items)
- **Button Press**: Quick scale down on active state (95%, 100ms)

## Component Selection

- **Components**:
  - **Dialog**: Create and edit memo forms in modal overlay
  - **Card**: Memo display with hover states and action buttons
  - **Button**: Primary actions (New Memo), secondary actions (Cancel), and icon buttons (Edit, Delete)
  - **Input**: Title field in memo forms, search field in header, username input in whitelist settings
  - **Textarea**: Multi-line content field in memo forms
  - **Avatar**: Display user GitHub avatar in header
  - **Alert Dialog**: Confirmation prompt for memo deletion
  - **Badge**: Display memo count and whitelist user count
  - **ScrollArea**: Smooth scrolling for memo grid on overflow
  - **Tabs**: Switch between Memos view and Settings view (owner only)

- **Customizations**:
  - Custom memo card component with gradient backgrounds and subtle shadows
  - Search bar with integrated icon and clear button
  - Empty state illustration using SVG pattern or phosphor icons composition
  - Staggered grid layout using CSS Grid with auto-fill

- **States**:
  - **Buttons**: Hover brightens accent color, active scales down, disabled reduces opacity to 50%
  - **Inputs**: Focus shows coral ring with subtle shadow, error state shows red border
  - **Cards**: Default has subtle shadow, hover elevates with stronger shadow and border highlight
  - **Dialog**: Backdrop blur with dark overlay, content slides and fades in

- **Icon Selection**:
  - New Memo: Plus (bold, prominent in floating action style)
  - Edit: PencilSimple (appears on card hover)
  - Delete: Trash (appears on card hover, destructive color)
  - Search: MagnifyingGlass (inline with search input)
  - User: User or UserCircle (fallback if no avatar)
  - Empty State: Note or NotePencil (large, muted)
  - Settings: Gear (tab navigation)
  - Memos Tab: Note (tab navigation)
  - Access Denied: Lock (large, duotone weight)
  - Whitelist: UserPlus (settings section header)

- **Spacing**:
  - Container padding: px-6 py-8
  - Card padding: p-6
  - Card gap in grid: gap-6
  - Form field spacing: space-y-4
  - Button padding: px-6 py-3 (primary), p-2 (icon buttons)
  - Section margins: mb-8 between major sections

- **Mobile**:
  - Grid switches from 3 columns → 2 columns → 1 column (lg:grid-cols-3 md:grid-cols-2 grid-cols-1)
  - Header stacks user info vertically on small screens
  - Dialog takes full screen on mobile with slide-up animation
  - Floating action button moves to bottom-right corner on mobile
  - Touch targets minimum 44px for all interactive elements
  - Reduced padding on containers (px-4 py-6 on mobile)
