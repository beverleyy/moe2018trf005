%% Manova & Anova analysis
%  Data set consists of 4 (nx2) vectors named alpha,beta,gamma,delta

clear all;
close all;
clc;

%% Notes
%  Figure 1: Scatter plot
%  Figure 2: Manova canonical variables plot
%  Figure 3: Anova table
%  Figure 4: Tukey plot
%  Figure 5: Anova table 2
%  Figure 6: Tukey plot 2

%% Load and organize data
load data.mat; % Change to actual data file

sp = [alpha(:,1); beta(:,1); gamma(:,1); delta(:,1)];
wr = [alpha(:,2); beta(:,2); gamma(:,2); delta(:,2)];

%% Create key (data grouping)
for i=1:length(alpha)
    alpha_key{i} = "alpha";
end
for i=1:length(beta)
    beta_key{i} = "beta";
end
for i=1:length(gamma)
    gamma_key{i} = "gamma";
end
for i=1:length(alpha)
    delta_key{i} = "delta";
end
key = string([alpha_key,beta_key,gamma_key,delta_key]');
clear alpha_key beta_key gamma_key delta_key i;

%% Visualize data on scatter plot
scatter = gscatter(sp,wr,key,'','xos');

%% Preliminary (Visual) Manova analysis
data = [sp wr];
[d,p,stats] = manova1(data,key,0.01);

% Plot canonical variables
c1 = stats.canon(:,1);
c2 = stats.canon(:,2);
figure();
gscatter(c2,c1,key,[],'oxs');

%% Perform Anova analysis
%  For sp value-add
[p_s,tbl_s,astat_s] = anova1(sp,key);
s_compare = multcompare(astat_s);

%  For wr value-add
[p_w,tbl_w,astat_w] = anova1(wr,key);
w_compare = multcompare(astat_w);

%% The real Manova with the numbers/stats
t = table(key,sp,wr,'VariableNames',{'group','sp','wr'});
Meas = table([1 2]','VariableNames',{'Scores'});
rm = fitrm(t,'sp-wr~group','WithinDesign',Meas);
manova(rm)
